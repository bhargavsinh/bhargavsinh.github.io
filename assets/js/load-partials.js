/* Load header/footer partials. Menu + theme use event delegation (works after inject). */
(function () {
  'use strict';

  var menuBound = false;

  function rootFromPage() {
    var dr = document.documentElement.getAttribute('data-root');
    if (dr === '' || dr === '.') return '';
    if (dr) return dr.endsWith('/') ? dr : dr + '/';
    var path = location.pathname || '/';
    if (path.indexOf('/404') !== -1 || path.indexOf('/offline') !== -1) return '/';
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

  function inject(el, html) {
    if (!el) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    var nodes = Array.prototype.slice.call(wrap.childNodes);
    var parent = el.parentNode;
    if (!parent) return;
    nodes.forEach(function (n) { parent.insertBefore(n, el); });
    parent.removeChild(el);
  }

  function drawerEls() {
    return {
      d: document.getElementById('drawer'),
      open: document.getElementById('menu-btn'),
      close: document.getElementById('drawer-close')
    };
  }

  function showDrawer() {
    var els = drawerEls();
    if (!els.d || !els.open) return;
    els.d.classList.add('open');
    els.d.setAttribute('aria-hidden', 'false');
    els.open.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function hideDrawer() {
    var els = drawerEls();
    if (!els.d || !els.open) return;
    els.d.classList.remove('open');
    els.d.setAttribute('aria-hidden', 'true');
    els.open.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleTheme() {
    var root = document.documentElement;
    var cur = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    var next = cur === 'light' ? 'dark' : 'light';
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

  /** One-time document-level handlers — survive partial inject */
  function bindGlobal() {
    if (menuBound) return;
    menuBound = true;

    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t) return;
      // climb for button/svg inside icon buttons
      var node = t.nodeType === 1 ? t : t.parentElement;
      if (!node) return;

      if (node.closest && node.closest('#menu-btn')) {
        e.preventDefault();
        e.stopPropagation();
        var d = document.getElementById('drawer');
        if (d && d.classList.contains('open')) hideDrawer();
        else showDrawer();
        return;
      }
      if (node.closest && node.closest('#drawer-close')) {
        e.preventDefault();
        hideDrawer();
        return;
      }
      if (node.closest && node.closest('#theme-btn')) {
        e.preventDefault();
        toggleTheme();
        return;
      }
      if (node.closest && node.closest('#drawer a')) {
        hideDrawer();
        return;
      }
      // backdrop click
      if (node.id === 'drawer' || (node.classList && node.classList.contains('drawer') && node === document.getElementById('drawer'))) {
        hideDrawer();
      }
    }, true);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideDrawer();
    });
  }

  function load() {
    bindGlobal();

    var root = rootFromPage();
    var shell = shellKey();
    var headerSlot = document.querySelector('[data-include="header"]');
    var footerSlot = document.querySelector('[data-include="footer"]');
    var jobs = [];

    if (headerSlot) {
      jobs.push(
        fetch(root + 'assets/partials/header-' + shell + '.html', { credentials: 'same-origin', cache: 'no-cache' })
          .then(function (r) { if (!r.ok) throw new Error('header ' + r.status); return r.text(); })
          .then(function (html) { inject(headerSlot, html); })
          .catch(function (e) { if (window.console) console.error('header partial', e); })
      );
    }
    if (footerSlot) {
      jobs.push(
        fetch(root + 'assets/partials/footer-' + shell + '.html', { credentials: 'same-origin', cache: 'no-cache' })
          .then(function (r) { if (!r.ok) throw new Error('footer ' + r.status); return r.text(); })
          .then(function (html) { inject(footerSlot, html); })
          .catch(function (e) { if (window.console) console.error('footer partial', e); })
      );
    }

    return Promise.all(jobs).then(function () {
      var ys = document.querySelectorAll('.js-year');
      for (var i = 0; i < ys.length; i++) ys[i].textContent = String(new Date().getFullYear());
      // sync theme button labels with current theme
      var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var btn = document.getElementById('theme-btn');
      if (btn) {
        btn.setAttribute('aria-pressed', cur === 'light' ? 'true' : 'false');
        btn.setAttribute('aria-label', cur === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      }
      document.dispatchEvent(new CustomEvent('partials:loaded'));
    });
  }

  // Bind ASAP so early clicks are not lost after inject
  bindGlobal();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
