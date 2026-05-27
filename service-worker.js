const CACHE_NAME = "keldeio-v2";
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
          .filter((cacheName) => cacheName !== CACHE_NAME)
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

  if (isNavigation || isAppFile) {
    event.respondWith(fetchAndUpdate(event.request, CACHE_NAME));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetchAndUpdate(event.request, CACHE_NAME);
    })
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
