/* Compat shim: chrome.js owns partials. Keep file so old <script src=load-partials> does not 404. */
(function () {
  if (window.__BS_CHROME__) return;
  var dr = document.documentElement.getAttribute('data-root');
  var root = (dr === '' || dr === '.') ? '' : (dr ? (dr.endsWith('/') ? dr : dr + '/') : '');
  if (!root) {
    var path = location.pathname || '/';
    var segs = path.split('/').filter(Boolean);
    if (segs.length && segs[segs.length - 1].indexOf('.') !== -1) segs.pop();
    root = segs.map(function () { return '../'; }).join('');
  }
  var s = document.createElement('script');
  s.src = root + 'assets/js/chrome.js?v=20.0.0';
  s.async = false;
  document.head.appendChild(s);
})();
