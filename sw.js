/**
 * V17.2 Service Worker
 * - Network-first for HTML navigations (avoid stale pages)
 * - Cache-first for versioned static assets
 * - Failed navigation → offline.html (NOT index.html)
 * - Explicit V17.2 cache namespace with deterministic cleanup of prior versions
 */
const CACHE_NAME = "bhargavsinh-portfolio-v17.2";
const OFFLINE_URL = "/offline.html";

const PRECACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/404.html",
  "/assets/css/portal-selector.css",
  "/assets/css/portal-common.css",
  "/assets/js/portal-page-shell.js",
  "/assets/js/portal-security.js",
  "/assets/images/portal-books.svg",
  "/assets/images/portal-recruiter.svg",
  "/assets/images/portal-visitor.svg",
  "/Book-Publications-Reader/BPindex.html",
  "/HR-Recruiter/HRRindex.html",
  "/Visitor/Visitindex.html", "/Visitor/policy-center.html",
  "/manifest.json",
  "/newlogo-192.png"
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

function isHTMLRequest(request) {
  if (request.mode === "navigate") return true;
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // HTML: network-first, offline page on total failure (never silent home redirect)
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

  // Static assets: cache-first, then network
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
