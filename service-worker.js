const DISABLE_CACHE_VERSION = "keldeio-pwa-disabled-v1";

console.log(`[Kelde.io PWA] disabling service worker cache: ${DISABLE_CACHE_VERSION}`);

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      })
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
      .then(() => {
        return self.clients.matchAll({ type: "window", includeUncontrolled: true });
      })
      .then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
      })
  );
});

self.addEventListener("fetch", () => {
  return;
});
