/* Runs in <head>, before paint: applies saved theme + font scale (no flash). */
(function () {
  try {
    var t = localStorage.getItem('bs_theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.setAttribute('data-theme', 'light');
    var f = parseFloat(localStorage.getItem('bs_fs'));
    if (f >= 0.85 && f <= 1.5) document.documentElement.style.setProperty('--fs', String(f));
  } catch (e) {}

  function rootPrefix() {
    var path = location.pathname || '/';
    if (path.indexOf('/404') !== -1 || path.indexOf('/offline') !== -1) return '/';
    var segs = path.split('/').filter(Boolean);
    if (segs.length && segs[segs.length - 1].indexOf('.') !== -1) segs.pop();
    if (!segs.length) return '';
    return segs.map(function () { return '../'; }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var l = document.querySelectorAll('link[data-fonts]');
    for (var i = 0; i < l.length; i++) l[i].media = 'all';

    var root = document.documentElement.getAttribute('data-root');
    if (root === null || root === undefined) root = rootPrefix();
    else if (root && root.slice(-1) !== '/' && root !== '') root = root + '/';

    // Header menu buttons CSS
    try {
      if (!document.querySelector('link[href*="header-buttons.css"]')) {
        var hl = document.createElement('link');
        hl.rel = 'stylesheet';
        hl.href = root + 'assets/css/header-buttons.css?v=19.0.6';
        document.head.appendChild(hl);
      }
    } catch (eH) {}

    // Footer button chart script
    try {
      if (!document.querySelector('script[data-footer-chart]')) {
        var s = document.createElement('script');
        s.src = root + 'assets/js/footer-chart.js?v=19.0.5';
        s.defer = true;
        s.setAttribute('data-footer-chart', '1');
        (document.body || document.documentElement).appendChild(s);
      }
    } catch (e2) {}
  });
})();
