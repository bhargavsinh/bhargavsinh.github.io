/* BS chrome ALL-IN-ONE v20.2 — embedded shell, no fetch race */
(function () {
  'use strict';
  if (window.__BS_CHROME__) return;
  window.__BS_CHROME__ = true;

  try {
    var t = localStorage.getItem('bs_theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.setAttribute('data-theme', 'light');
    var f = parseFloat(localStorage.getItem('bs_fs'));
    if (f >= 0.85 && f <= 1.5) document.documentElement.style.setProperty('--fs', String(f));
  } catch (e0) {}

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

  function ensureCss(href) {
    var key = href.split('/').pop().split('?')[0];
    if (document.querySelector('link[href*="' + key + '"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }

  function inject(el, html) {
    if (!el || !el.parentNode) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
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
    document.documentElement.setAttribute('data-theme', next);
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

  document.addEventListener('click', function (e) {
    var node = e.target;
    if (!node) return;
    if (node.nodeType !== 1) node = node.parentElement;
    if (!node || !node.closest) return;
    if (node.closest('#menu-btn')) {
      e.preventDefault(); e.stopPropagation();
      var d = document.getElementById('drawer');
      if (d && d.classList.contains('open')) hideDrawer(); else showDrawer();
      return;
    }
    if (node.closest('#drawer-close')) { e.preventDefault(); hideDrawer(); return; }
    if (node.closest('#theme-btn')) { e.preventDefault(); toggleTheme(); return; }
    if (node.closest('#drawer a')) { hideDrawer(); return; }
    if (node.id === 'drawer') hideDrawer();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideDrawer(); });

  var HEADER_TPL = "<div class=\"progress\" id=\"progress\" aria-hidden=\"true\"><i></i></div>\n<a class=\"skip\" href=\"#main\">Skip to content</a>\n<header class=\"bar\" id=\"top\">\n  <div class=\"bar-in\">\n    <a class=\"brand\" href=\"ROOTINDEXhtml\" aria-label=\"BHARGAVSINH SISODIYA — home\"><span>BHARGAV<b>SINH</b></span></a>\n    <nav class=\"nav\" aria-label=\"Primary\">\n      <a href=\"ROOTINDEXhtml\">Home</a>\n      <a href=\"ROOTPATHabout/\">About</a>\n      <a href=\"ROOTPATHprojects/\">Projects</a>\n      <a href=\"ROOTPATHpublications/\">Publications</a>\n      <a href=\"ROOTPATHresearch/\">Research</a>\n      <a href=\"ROOTPATHcontact/\">Contact</a>\n    </nav>\n    <div class=\"bar-tools\">\n      <button class=\"ib\" type=\"button\" data-search aria-label=\"Search\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg></button>\n      <button class=\"ib\" type=\"button\" id=\"theme-btn\" aria-label=\"Switch theme\" aria-pressed=\"false\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z\"/></svg></button>\n      <button class=\"ib menu-btn\" type=\"button\" id=\"menu-btn\" aria-label=\"Open menu\" aria-expanded=\"false\" aria-controls=\"drawer\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 7h16M4 12h16M4 17h16\"/></svg></button>\n    </div>\n  </div>\n</header>\n<div class=\"drawer\" id=\"drawer\" aria-hidden=\"true\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Menu\">\n  <div class=\"drawer-panel\">\n    <div class=\"drawer-top\"><strong>Menu</strong><button class=\"ib\" type=\"button\" id=\"drawer-close\" aria-label=\"Close menu\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 6l12 12M18 6 6 18\"/></svg></button></div>\n    <nav aria-label=\"Primary (mobile)\">\n      <a href=\"ROOTINDEXhtml\">Home</a>\n      <a href=\"ROOTPATHabout/\">About</a>\n      <a href=\"ROOTPATHprojects/\">Projects</a>\n      <a href=\"ROOTPATHpublications/\">Publications</a>\n      <a href=\"ROOTPATHresearch/\">Research</a>\n      <a href=\"ROOTPATHcontact/\">Contact</a>\n    </nav>\n    <h5>Portals</h5>\n    <nav aria-label=\"Portals\">\n      <a href=\"ROOTPATHVisitor/Visitindex.html\">Visitor</a>\n      <a href=\"ROOTPATHHR-Recruiter/HRRindex.html\">HR Recruiter</a>\n      <a href=\"ROOTPATHBook-Publications-Reader/BPindex.html\">Books</a>\n    </nav>\n  </div>\n</div>";

  function buildHeader(r) {
    return HEADER_TPL
      .replace(/ROOTINDEXhtml/g, r + 'index.html')
      .replace(/ROOTPATH/g, r);
  }

  function mount() {
    var r = root();
    ensureCss(r + 'assets/css/chrome.css?v=20.2.0');
    ensureCss(r + 'assets/css/header-buttons.css?v=19.0.6');

    var headerSlot = document.querySelector('[data-include="header"]');
    if (headerSlot) inject(headerSlot, buildHeader(r));

    var footerSlot = document.querySelector('[data-include="footer"]');
    if (footerSlot) {
      var shell = (document.body && document.body.getAttribute('data-shell')) || 'home';
      fetch(r + 'assets/partials/footer-' + shell + '.html', { credentials: 'same-origin', cache: 'no-cache' })
        .then(function (res) { return res.ok ? res.text() : Promise.reject(); })
        .then(function (html) { inject(footerSlot, html); })
        .catch(function () {
          inject(footerSlot, '<footer class="foot"><div class="foot-base"><span>© <span class="js-year"></span> BHARGAVSINH SISODIYA</span></div></footer>');
          var y = document.querySelector('.js-year');
          if (y) y.textContent = String(new Date().getFullYear());
        });
    }

    var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(cur);
    document.dispatchEvent(new CustomEvent('partials:loaded'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
