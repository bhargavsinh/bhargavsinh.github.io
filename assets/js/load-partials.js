/* Load header/footer partials, then bind mobile menu + tools. */
(function () {
  'use strict';

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
    nodes.forEach(function (n) { parent.insertBefore(n, el); });
    parent.removeChild(el);
  }

  /** Mobile drawer — must run AFTER header partial is in the DOM */
  function bindMobileMenu() {
    var d = document.getElementById('drawer');
    var open = document.getElementById('menu-btn');
    var close = document.getElementById('drawer-close');
    if (!d || !open) return;
    if (open.getAttribute('data-menu-bound') === '1') return;
    open.setAttribute('data-menu-bound', '1');

    var last = null;
    function show() {
      last = document.activeElement;
      d.classList.add('open');
      d.setAttribute('aria-hidden', 'false');
      open.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (close) setTimeout(function () { close.focus(); }, 50);
    }
    function hide() {
      d.classList.remove('open');
      d.setAttribute('aria-hidden', 'true');
      open.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (last && last.focus) last.focus();
    }

    open.addEventListener('click', function (e) {
      e.preventDefault();
      if (d.classList.contains('open')) hide();
      else show();
    });
    if (close) close.addEventListener('click', function (e) { e.preventDefault(); hide(); });
    d.addEventListener('click', function (e) { if (e.target === d) hide(); });
    var links = d.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', hide);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && d.classList.contains('open')) hide();
    });
  }

  function bindSearchOpeners() {
    // site.js owns search; re-dispatch so late-bound [data-search] work if needed
    document.dispatchEvent(new CustomEvent('partials:loaded'));
  }

  function load() {
    var root = rootFromPage();
    var shell = shellKey();
    var headerSlot = document.querySelector('[data-include="header"]');
    var footerSlot = document.querySelector('[data-include="footer"]');
    var jobs = [];

    if (headerSlot) {
      jobs.push(
        fetch(root + 'assets/partials/header-' + shell + '.html', { credentials: 'same-origin' })
          .then(function (r) { if (!r.ok) throw new Error('header ' + r.status); return r.text(); })
          .then(function (html) { inject(headerSlot, html); })
          .catch(function (e) { if (window.console) console.error('header partial', e); })
      );
    }
    if (footerSlot) {
      jobs.push(
        fetch(root + 'assets/partials/footer-' + shell + '.html', { credentials: 'same-origin' })
          .then(function (r) { if (!r.ok) throw new Error('footer ' + r.status); return r.text(); })
          .then(function (html) { inject(footerSlot, html); })
          .catch(function (e) { if (window.console) console.error('footer partial', e); })
      );
    }

    return Promise.all(jobs).then(function () {
      var ys = document.querySelectorAll('.js-year');
      for (var i = 0; i < ys.length; i++) ys[i].textContent = String(new Date().getFullYear());
      bindMobileMenu();
      bindSearchOpeners();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
