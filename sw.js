const CACHE = "0bsession-v8";
const STALE_ASSETS = ["/images/background.jpg"];
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/config.js",
  "/i18n.js",
  "/favicon.svg",
  "/manifest.json",
  "/og-image.png",
  "/projects/vogue-way.html",
  "/projects/panorama.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all([
        ...keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
        ...STALE_ASSETS.map((url) =>
          caches.open(CACHE).then((cache) => cache.delete(url))
        ),
      ])
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isAsset = /\.(js|css|html)$/.test(url.pathname) || url.pathname === "/";

  event.respondWith(
    isAsset
      ? fetch(event.request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => caches.match(event.request))
      : caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.ok && url.origin === self.location.origin) {
              const clone = response.clone();
              caches.open(CACHE).then((cache) => cache.put(event.request, clone));
            }
            return response;
          });
        })
  );
});
