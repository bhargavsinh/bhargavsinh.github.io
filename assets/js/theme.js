/* Runs in <head>, before paint: applies saved theme + font scale (no flash). */
(function () {
  try {
    var t = localStorage.getItem('bs_theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.setAttribute('data-theme', 'light');
    var f = parseFloat(localStorage.getItem('bs_fs'));
    if (f >= 0.85 && f <= 1.5) document.documentElement.style.setProperty('--fs', String(f));
  } catch (e) {}
  document.addEventListener('DOMContentLoaded', function () {
    var l = document.querySelectorAll('link[data-fonts]');
    for (var i = 0; i < l.length; i++) l[i].media = 'all';
    // Footer button chart (all pages that include theme.js)
    try {
      if (document.querySelector('script[data-footer-chart]')) return;
      var root = document.documentElement.getAttribute('data-root') || '';
      var s = document.createElement('script');
      s.src = root + 'assets/js/footer-chart.js?v=19.0.5';
      s.defer = true;
      s.setAttribute('data-footer-chart', '1');
      (document.body || document.documentElement).appendChild(s);
    } catch (e2) {}
  });
})();
