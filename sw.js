const CACHE_NAME = "bhargavsinh-portfolio-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/a1logo.png",
  "/colors.css",
  "/Mewad_history_blog.html",
  "/about.html",
  "/contact.html",
  "/ghostwriting.html",
  "/grievance.html",
  "/disclaimer.html",
  "/ananadviharbhavan.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
