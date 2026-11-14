/* Ensure header-buttons CSS is present (theme.js pages). */
(function () {
  'use strict';
  function rootPrefix() {
    var path = location.pathname || '/';
    if (path.indexOf('/404') !== -1 || path.indexOf('/offline') !== -1) return '/';
    var segs = path.split('/').filter(Boolean);
    if (segs.length && segs[segs.length - 1].indexOf('.') !== -1) segs.pop();
    if (!segs.length) return '';
    return segs.map(function () { return '../'; }).join('');
  }
  try {
    if (document.querySelector('link[href*="header-buttons.css"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = rootPrefix() + 'assets/css/header-buttons.css?v=19.0.6';
    document.head.appendChild(l);
  } catch (e) {}
})();
