const CACHE_NAME = 'bhargavsinh-pwa-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/contact.html',
  '/about.html',
  '/projects.html',
  '/pushtimarg.html',
  '/resume.html',
  '/newlogo-192.jpg',
  '/newlogo-512.jpg'
];

// 1. Install Service Worker & Cache Files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch Requests (Serve from cache if available)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // જો ડેટા કેશમાં હોય તો તે આપો, નહીંતર ઇન્ટરનેટ પરથી લાવો
        return response || fetch(event.request);
      })
  );
});

// 3. Update Service Worker (Clear old caches)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
