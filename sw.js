/* Service worker — V19.0.0
   Navigation: network-first (4 s timeout) → cache → offline page.
   Same-origin assets + Google Fonts: stale-while-revalidate. Old caches are purged on activate. */
const VERSION = '19.0.0';
const CACHE = 'bs-' + VERSION;
const FONTS = 'bs-fonts';
const OFFLINE = '/offline.html';
const PRECACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/404.html",
  "/sitemap.html",
  "/changelog.html",
  "/manifest.json",
  "/about/",
  "/projects/",
  "/publications/",
  "/research/",
  "/contact/",
  "/assets/css/site.css?v=18.1.0",
  "/assets/css/bento-editorial.css?v=18.2.0",
  "/assets/css/swiss.css?v=19.0.0",
  "/assets/css/protect-l4.css?v=18.1.3",
  "/assets/js/site.js?v=18.1.0",
  "/assets/js/theme.js?v=18.1.0",
  "/assets/js/protect-l4.js?v=18.1.3",
  "/assets/search-index.json",
  "/assets/images/brand/brand-mark.webp",
  "/assets/images/brand/brand-mark-192.png",
  "/assets/images/portals/portal-books.webp",
  "/assets/images/portals/portal-hr.webp",
  "/assets/images/portals/portal-visitor.webp",
  "/Visitor/Visitindex.html",
  "/Visitor/about.html",
  "/Visitor/blog.html",
  "/Visitor/Mewad_history_blog.html",
  "/Visitor/vanshavali.html",
  "/Visitor/ananadviharbhavan.html",
  "/Visitor/contact.html",
  "/Visitor/policy-center.html",
  "/Visitor/privacy-policy.html",
  "/Visitor/termsofuse.html",
  "/Visitor/disclaimer.html",
  "/Visitor/grievance.html",
  "/Visitor/cookies-policy.html",
  "/Visitor/copyright-policy.html",
  "/Visitor/content-editorial-policy.html",
  "/Visitor/data-retention-policy.html",
  "/Visitor/accessibility-statement.html",
  "/Visitor/third-party-policy.html",
  "/HR-Recruiter/HRRindex.html",
  "/HR-Recruiter/resume.html",
  "/HR-Recruiter/projects.html",
  "/HR-Recruiter/pwriter.html",
  "/HR-Recruiter/ghostwriting.html",
  "/Book-Publications-Reader/BPindex.html",
  "/Book-Publications-Reader/otherlinks.html",
  "/Book-Publications-Reader/satyanisodh.html",
  "/Book-Publications-Reader/astitva-garima.html",
  "/Book-Publications-Reader/mahabharat-rajdharma.html",
  "/Book-Publications-Reader/pushtimarg.html",
  "/Book-Publications-Reader/pushtimarg-ma-gruh-seva.html",
  "/Book-Publications-Reader/bookreadingpolicy.html"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== FONTS).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

function swr(req, isFont) {
  const bucket = isFont ? FONTS : CACHE;
  return caches.open(bucket).then((cache) =>
    cache.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            cache.put(req, copy);
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  const isFont =
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    (same && /\.(woff2?|ttf|otf)(\?|$)/i.test(url.pathname));

  if (req.mode === 'navigate') {
    e.respondWith(
      (async () => {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 4000);
        try {
          const res = await fetch(req, { signal: ctrl.signal });
          clearTimeout(t);
          if (res && res.ok) {
            const cache = await caches.open(CACHE);
            cache.put(req, res.clone());
          }
          return res;
        } catch (err) {
          clearTimeout(t);
          const cache = await caches.open(CACHE);
          return (await cache.match(req)) || (await cache.match(OFFLINE)) || Response.error();
        }
      })()
    );
    return;
  }

  if (same || isFont) {
    e.respondWith(swr(req, isFont));
  }
});
