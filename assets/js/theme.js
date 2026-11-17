/* Bootstrap: apply theme early, then load chrome.js (menu + partials + theme toggle). */
(function () {
  'use strict';
  try {
    var t = localStorage.getItem('bs_theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.setAttribute('data-theme', 'light');
    var f = parseFloat(localStorage.getItem('bs_fs'));
    if (f >= 0.85 && f <= 1.5) document.documentElement.style.setProperty('--fs', String(f));
  } catch (e) {}

  function root() {
    var dr = document.documentElement.getAttribute('data-root');
    if (dr === '' || dr === '.') return '';
    if (dr) return dr.endsWith('/') ? dr : dr + '/';
    var path = location.pathname || '/';
    var segs = path.split('/').filter(Boolean);
    if (segs.length && segs[segs.length - 1].indexOf('.') !== -1) segs.pop();
    if (!segs.length) return '';
    return segs.map(function () { return '../'; }).join('');
  }

  // Always load the strong chrome layer (cache-busted)
  var s = document.createElement('script');
  s.src = root() + 'assets/js/chrome.js?v=20.0.0';
  s.async = false;
  (document.head || document.documentElement).appendChild(s);

  document.addEventListener('DOMContentLoaded', function () {
    var fonts = document.querySelectorAll('link[data-fonts]');
    for (var i = 0; i < fonts.length; i++) fonts[i].media = 'all';
  });
})();
