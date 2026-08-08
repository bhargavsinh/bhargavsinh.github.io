const CACHE_NAME = "bhargavsinh-portfolio-v12.1";
const urlsToCache = [
  "/",
  "/index.html",
  "/Mewad_history_blog.html",
  "/README.md",
  "/allogo.png",
  "/about.html",
  "/ananadviharbhavan.html",
  "/bhargavsinh.webp",
  "/bhargavsinh1.jpg",
  "/blog.html",
  "/bookreadingpolicy.html",
  "/colors.css",
  "/contact.html",
  "/disclaimer.html",
  "/footer.html",
  "/ghostwriting.html",
  "/grievance.html",
  "/header.html",
  "/lion.mp3",
  "/logo.png",
  "/manifest.json",
  "/newlogo-192.png",
  "/newlogo-512.png",
  "/newlogo.png",
  "/notifications.json",
  "/otherlinks.html",
  "/privacy-policy.html",
  "/projects.html",
  "/pushtimarg-ma-gruh-seva.html",
  "/pushtimarg.html",
  "/pwriter.html",
  "/responsive.css",
  "/resume.html",
  "/robots.txt",
  "/satyanisodh.html",
  "/script.js",
  "/sitemap.xml",
  "/style.css",
  "/sw.js",
  "/vanshavali.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // જો ફાઈલ કેશમાં હોય તો ત્યાંથી આપશે, નહીંતર નેટવર્કમાંથી લાવશે
        return response || fetch(event.request);
      })
  );
});
