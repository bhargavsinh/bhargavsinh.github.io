/* Service worker — V18.1.0
   Navigation: network-first (4 s timeout) → cache → offline page.
   Same-origin assets + Google Fonts: stale-while-revalidate. Old caches are purged on activate. */
const VERSION = '18.1.0';
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
  "/assets/js/site.js?v=18.1.0",
  "/assets/js/theme.js?v=18.1.0",
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
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => {})))));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== FONTS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });

function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)); }

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    event.respondWith(
      Promise.race([fetch(req), timeout(4000)])
        .then((res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match(OFFLINE)))
    );
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !isFont) return;                       // e.g. Formspree: never touch

  const bucket = isFont ? FONTS : CACHE;
  event.respondWith(
    caches.open(bucket).then((cache) =>
      cache.match(req).then((hit) => {
        const net = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      })
    )
  );
});
