/* Service worker — V19.0.7 */
const VERSION = '19.0.7';
const CACHE = 'bs-' + VERSION;
const FONTS = 'bs-fonts';
const OFFLINE = '/offline.html';
const PRECACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/404.html",
  "/manifest.json",
  "/assets/js/site.js?v=19.0.7",
  "/assets/js/load-partials.js?v=19.0.7",
  "/assets/js/theme.js?v=19.0.6",
  "/assets/js/protect-l4.js?v=18.1.3",
  "/assets/partials/header-home.html",
  "/assets/partials/footer-home.html",
  "/assets/partials/header-visitor.html",
  "/assets/partials/footer-visitor.html",
  "/assets/partials/header-hr.html",
  "/assets/partials/footer-hr.html",
  "/assets/partials/header-books.html",
  "/assets/partials/footer-books.html",
  "/assets/css/site.css?v=18.1.0",
  "/assets/css/footer-chart.css?v=19.0.5",
  "/assets/css/header-buttons.css?v=19.0.6"
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(PRECACHE.map(function (u) { return c.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE && k !== FONTS; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isNav(req) {
  return req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept') && req.headers.get('accept').indexOf('text/html') !== -1);
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    e.respondWith(
      caches.open(FONTS).then(function (cache) {
        return cache.match(req).then(function (hit) {
          var net = fetch(req).then(function (res) {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(function () { return hit; });
          return hit || net;
        });
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (isNav(req)) {
    e.respondWith((async function () {
      var ctrl = new AbortController();
      var t = setTimeout(function () { ctrl.abort(); }, 4000);
      try {
        var res = await fetch(req, { signal: ctrl.signal });
        clearTimeout(t);
        var cache = await caches.open(CACHE);
        cache.put(req, res.clone());
        return res;
      } catch (err) {
        clearTimeout(t);
        var cache2 = await caches.open(CACHE);
        return (await cache2.match(req)) || (await cache2.match('/index.html')) || (await cache2.match(OFFLINE)) || Response.error();
      }
    })());
    return;
  }

  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      });
    })
  );
});

self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
