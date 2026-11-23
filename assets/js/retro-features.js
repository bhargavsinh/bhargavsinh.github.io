/* V20.4.0 — Live clock + portal switcher helpers (Early 2000s) */
(function () {
  'use strict';
  if (window.__RETRO_FEATURES__) return;
  window.__RETRO_FEATURES__ = true;

  function tick() {
    var nodes = document.querySelectorAll('#ps-clock, .ps-clock');
    if (!nodes.length) return;
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
    var am = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (!h) h = 12;
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var text = pad(h) + ':' + pad(m) + ':' + pad(s) + ' ' + am;
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = text;
  }

  function markCurrent() {
    var path = (location.pathname || '').toLowerCase();
    var links = document.querySelectorAll('.portal-switch a, .nav-bar a.btn');
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute('href') || '').toLowerCase();
      if (!href || href === '#' || href.indexOf('javascript:') === 0) continue;
      if (path.indexOf('visit') !== -1 && href.indexOf('visit') !== -1) links[i].classList.add('current');
      if (path.indexOf('hr-recruiter') !== -1 && href.indexOf('hr') !== -1) links[i].classList.add('current');
      if (path.indexOf('book-publications') !== -1 && href.indexOf('book') !== -1) links[i].classList.add('current');
      if (path.indexOf('portals') !== -1 && href.indexOf('portals') !== -1) links[i].classList.add('current');
    }
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    tick();
    setInterval(tick, 1000);
    markCurrent();
  });
})();
