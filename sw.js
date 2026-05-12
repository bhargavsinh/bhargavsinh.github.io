const CACHE_NAME = 'bhargavsinh-pwa-v2'; // અહીં v1 નું v2 કર્યું છે
const urlsToCache = [
  '/',
  '/index.html',
  '/contact.html',
  '/about.html',
  '/projects.html',
  '/pushtimarg.html',
  '/resume.html',
  '/newlogo-192.jpg',
  '/newlogo-512.jpg',
  '/logo.png'
];
// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // જો ડેટા કેશમાં હોય તો તે આપો, નહીંતર નેટવર્કમાંથી લાવો
        return response || fetch(event.request);
      })
  );
});

// Update Service Worker
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