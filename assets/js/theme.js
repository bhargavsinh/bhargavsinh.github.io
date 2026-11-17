/* Theme + global header controls (menu / night mode). Runs in <head>. */
(function () {
  'use strict';

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

  function showDrawer() {
    var d = document.getElementById('drawer');
    var open = document.getElementById('menu-btn');
    if (!d || !open) return;
    d.classList.add('open');
    d.setAttribute('aria-hidden', 'false');
    open.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function hideDrawer() {
    var d = document.getElementById('drawer');
    var open = document.getElementById('menu-btn');
    if (!d || !open) return;
    d.classList.remove('open');
    d.setAttribute('aria-hidden', 'true');
    open.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleTheme() {
    var root = document.documentElement;
    var cur = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    var next = cur === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('bs_theme', next); } catch (err) {}
    var btn = document.getElementById('theme-btn');
    if (btn) {
      btn.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
      btn.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = next === 'light' ? '#f7f1e6' : '#0e0a08';
  }

  // Capture-phase delegation: works even when header is injected later
  document.addEventListener('click', function (e) {
    var node = e.target;
    if (!node) return;
    if (node.nodeType !== 1) node = node.parentElement;
    if (!node || !node.closest) return;

    if (node.closest('#menu-btn')) {
      e.preventDefault();
      e.stopPropagation();
      var d = document.getElementById('drawer');
      if (d && d.classList.contains('open')) hideDrawer();
      else showDrawer();
      return;
    }
    if (node.closest('#drawer-close')) {
      e.preventDefault();
      hideDrawer();
      return;
    }
    if (node.closest('#theme-btn')) {
      e.preventDefault();
      toggleTheme();
      return;
    }
    if (node.closest('#drawer a')) {
      hideDrawer();
      return;
    }
    if (node.id === 'drawer') {
      hideDrawer();
    }
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hideDrawer();
  });

  document.addEventListener('DOMContentLoaded', function () {
    var l = document.querySelectorAll('link[data-fonts]');
    for (var i = 0; i < l.length; i++) l[i].media = 'all';

    var root = document.documentElement.getAttribute('data-root');
    if (root === null || root === undefined) root = rootPrefix();
    else if (root && root.slice(-1) !== '/' && root !== '') root = root + '/';

    try {
      if (!document.querySelector('link[href*="header-buttons.css"]')) {
        var hl = document.createElement('link');
        hl.rel = 'stylesheet';
        hl.href = root + 'assets/css/header-buttons.css?v=19.0.6';
        document.head.appendChild(hl);
      }
    } catch (eH) {}
  });
})();
