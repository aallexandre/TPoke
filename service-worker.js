const CACHE_NAME = "kelde-io-v3";
const RUNTIME_CACHE_NAME = "kelde-io-runtime-v2";
const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon.svg"
];
const UPDATE_FIRST_FILES = new Set(
  APP_FILES
    .filter((file) => ["./", "./index.html", "./style.css", "./script.js"].includes(file))
    .map((file) => new URL(file, self.registration.scope).href)
);

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
          .filter((cacheName) => ![CACHE_NAME, RUNTIME_CACHE_NAME].includes(cacheName))
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
  const isAppFile = UPDATE_FIRST_FILES.has(requestUrl.href);
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

      return fetchAndUpdate(event.request, RUNTIME_CACHE_NAME);
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
