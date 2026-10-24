/**
 * V17.5.2 Service Worker — network-first HTML, cache-first static, image precache
 */
const CACHE_NAME = "bhargavsinh-portfolio-v17.5.2";
const OFFLINE_URL = "/offline.html";

const PRECACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/404.html",
  "/sitemap.html",
  "/changelog.html",
  "/manifest.json",
  "/assets/images/brand/brand-mark.webp",
  "/assets/images/brand/brand-mark-192.png",
  "/assets/images/brand/brand-mark-512.png",
  "/assets/images/portals/portal-books.webp",
  "/assets/images/portals/portal-hr.webp",
  "/assets/images/portals/portal-visitor.webp",
  "/assets/images/ui/ui-offline.svg",
  "/assets/images/ui/ui-404.svg",
  "/assets/images/ui/ui-search-empty.svg",
  "/assets/images/social/og-default.webp",
  "/assets/css/portal-selector.css",
  "/assets/css/portal-common.css",
  "/assets/css/v17.3-enhancements.css",
  "/assets/css/v17.4-enhancements.css",
  "/assets/css/v17.5-enhancements.css",
  "/assets/css/intro.css",
  "/assets/js/portal-page-shell.js",
  "/assets/js/portal-security.js",
  "/assets/js/v17.5-ux.js",
  "/assets/js/site-search.js",
  "/assets/js/search-index.json",
  "/assets/js/intro.js",
  "/Book-Publications-Reader/BPindex.html",
  "/HR-Recruiter/HRRindex.html",
  "/Visitor/Visitindex.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

function isHTMLRequest(request) {
  if (request.mode === "navigate") return true;
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (isHTMLRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.ok && request.url.startsWith(self.location.origin)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
