/* Load header/footer HTML partials for home + portals. */
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
      document.dispatchEvent(new CustomEvent('partials:loaded'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
