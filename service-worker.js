const CACHE_VERSION = "v4";
const CACHE_NAME = `keldeio-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `keldeio-images-${CACHE_VERSION}`;
const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon.svg"
];
const NETWORK_FIRST_FILES = new Set([
  new URL("./", self.registration.scope).href,
  new URL("./index.html", self.registration.scope).href,
  new URL("./style.css", self.registration.scope).href,
  new URL("./script.js", self.registration.scope).href,
  new URL("./manifest.json", self.registration.scope).href
]);

console.log(`[Kelde.io PWA] service worker cache ${CACHE_NAME}`);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => ![CACHE_NAME, IMAGE_CACHE_NAME].includes(cacheName))
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isAppFile = NETWORK_FIRST_FILES.has(requestUrl.href);
  const isNavigation = event.request.mode === "navigate";
  const isImage = event.request.destination === "image";

  if (isNavigation || isAppFile) {
    event.respondWith(fetchAndUpdate(event.request, CACHE_NAME));
    return;
  }

  if (isImage) {
    event.respondWith(cacheFirst(event.request, IMAGE_CACHE_NAME));
    return;
  }

  event.respondWith(
    fetchAndUpdate(event.request, CACHE_NAME)
  );
});

function fetchAndUpdate(request, cacheName) {
  return fetch(request)
    .then((networkResponse) => {
      if (!networkResponse || ![200, 0].includes(networkResponse.status)) {
        return networkResponse;
      }

      return caches.open(cacheName).then((cache) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    })
    .catch(() => {
      return caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return undefined;
      });
    });
}

function cacheFirst(request, cacheName) {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      return cachedResponse;
    }

    return fetchAndUpdate(request, cacheName);
  });
}
