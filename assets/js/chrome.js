/* BS Chrome V20 — header/footer partials + menu + theme. One file for all pages. */
(function () {
  'use strict';
  if (window.__BS_CHROME__) return;
  window.__BS_CHROME__ = true;

  function assetRoot() {
    var dr = document.documentElement.getAttribute('data-root');
    if (dr === '' || dr === '.') return '';
    if (dr != null && dr !== undefined && dr !== '') {
      return dr.endsWith('/') ? dr : dr + '/';
    }
    var path = location.pathname || '/';
    if (/\/(404|offline)(\.html)?$/i.test(path)) return '/';
    var segs = path.split('/').filter(Boolean);
    if (segs.length && segs[segs.length - 1].indexOf('.') !== -1) segs.pop();
    if (!segs.length) return '';
    return segs.map(function () { return '../'; }).join('');
  }

  function shellKey() {
    var b = document.body && document.body.getAttribute('data-shell');
    if (b) return b;
    var p = location.pathname || '';
    if (p.indexOf('/Visitor/') !== -1) return 'visitor';
    if (p.indexOf('/HR-Recruiter/') !== -1) return 'hr';
    if (p.indexOf('/Book-Publications-Reader/') !== -1) return 'books';
    return 'home';
  }

  function ensureCss(href) {
    if (document.querySelector('link[href*="' + href.split('/').pop().split('?')[0] + '"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }

  function inject(el, html) {
    if (!el || !el.parentNode) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = String(html).trim();
    var parent = el.parentNode;
    while (wrap.firstChild) parent.insertBefore(wrap.firstChild, el);
    parent.removeChild(el);
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

  function applyTheme(next) {
    var root = document.documentElement;
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('bs_theme', next); } catch (e) {}
    var btn = document.getElementById('theme-btn');
    if (btn) {
      btn.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
      btn.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = next === 'light' ? '#f7f1e6' : '#0e0a08';
  }

  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(cur === 'light' ? 'dark' : 'light');
  }

  // Capture-phase: works on every page after partial inject
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
    if (node.id === 'drawer') hideDrawer();
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hideDrawer();
  });

  function loadPartials() {
    var root = assetRoot();
    ensureCss(root + 'assets/css/chrome.css?v=20.0.0');
    ensureCss(root + 'assets/css/footer-chart.css?v=19.0.5');
    ensureCss(root + 'assets/css/header-buttons.css?v=19.0.6');

    var shell = shellKey();
    if (document.body && !document.body.getAttribute('data-shell')) {
      document.body.setAttribute('data-shell', shell);
    }

    var headerSlot = document.querySelector('[data-include="header"]');
    var footerSlot = document.querySelector('[data-include="footer"]');
    var jobs = [];

    function get(url) {
      return fetch(url, { credentials: 'same-origin', cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error(url + ' ' + r.status);
        return r.text();
      });
    }

    if (headerSlot) {
      jobs.push(
        get(root + 'assets/partials/header-' + shell + '.html')
          .then(function (html) { inject(headerSlot, html); })
          .catch(function (err) { if (window.console) console.error('[chrome] header', err); })
      );
    }
    if (footerSlot) {
      jobs.push(
        get(root + 'assets/partials/footer-' + shell + '.html')
          .then(function (html) { inject(footerSlot, html); })
          .catch(function (err) { if (window.console) console.error('[chrome] footer', err); })
      );
    }

    Promise.all(jobs).then(function () {
      var ys = document.querySelectorAll('.js-year');
      for (var i = 0; i < ys.length; i++) ys[i].textContent = String(new Date().getFullYear());
      var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(cur);
      document.dispatchEvent(new CustomEvent('partials:loaded'));
      document.dispatchEvent(new CustomEvent('bs:chrome-ready'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPartials);
  } else {
    loadPartials();
  }
})();
