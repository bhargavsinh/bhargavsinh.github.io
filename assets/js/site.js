/* BHARGAVSINH SISODIYA — Digital Universe · V18 · single site script.
   Features are independent and guarded: a failure in one never breaks the rest. */
(function () {
  'use strict';

  // ---- Config -------------------------------------------------------------
  var PROTECT = true;            // deterrence on author's original long-form pages (body[data-protect]); set false to disable
  var ROOT = document.documentElement.getAttribute('data-root') || '';
  var doc = document, root = doc.documentElement;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) { return null; } }
  function sess(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function on(el, ev, fn, o) { if (el) el.addEventListener(ev, fn, o); }
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.error(e); } }
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Theme + font scale -------------------------------------------------
  safe(function () {
    var btn = $('#theme-btn');
    function cur() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
    function sync() { if (btn) { btn.setAttribute('aria-label', cur() === 'light' ? 'Switch to dark theme' : 'Switch to light theme'); btn.setAttribute('aria-pressed', cur() === 'light'); } var m = $('meta[name="theme-color"]'); if (m) m.content = cur() === 'light' ? '#f7f1e6' : '#0e0a08'; }
    on(btn, 'click', function () { var n = cur() === 'light' ? 'dark' : 'light'; root.setAttribute('data-theme', n); store('bs_theme', n); sync(); });
    sync();
    function scale(d) {
      var f = parseFloat(getComputedStyle(root).getPropertyValue('--fs')) || 1;
      f = Math.min(1.5, Math.max(0.85, Math.round((f + d) * 100) / 100));
      root.style.setProperty('--fs', String(f)); store('bs_fs', String(f));
    }
    on($('#fs-up'), 'click', function () { scale(0.1); });
    on($('#fs-down'), 'click', function () { scale(-0.1); });
  });

  // ---- Mobile drawer ------------------------------------------------------
  safe(function () {
    var d = $('#drawer'), open = $('#menu-btn'), close = $('#drawer-close');
    if (!d || !open) return;
    var last;
    function show() { last = doc.activeElement; d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); open.setAttribute('aria-expanded', 'true'); doc.body.style.overflow = 'hidden'; setTimeout(function () { close && close.focus(); }, 60); }
    function hide() { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); open.setAttribute('aria-expanded', 'false'); doc.body.style.overflow = ''; last && last.focus && last.focus(); }
    on(open, 'click', show); on(close, 'click', hide);
    on(d, 'click', function (e) { if (e.target === d) hide(); });
    $$('a', d).forEach(function (a) { on(a, 'click', hide); });
    on(doc, 'keydown', function (e) { if (e.key === 'Escape' && d.classList.contains('open')) hide(); });
  });

  // ---- Reading progress + floating tools ---------------------------------
  safe(function () {
    var bar = $('#progress > i'), tools = $('#tools');
    if (!bar && !tools) return;
    function update() {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      if (bar) bar.style.transform = 'scaleX(' + p + ')';
      if (tools) tools.classList.toggle('show', window.scrollY > 400);
    }
    on(window, 'scroll', update, { passive: true }); update();
    on($('#top-btn'), 'click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
  });

  // ---- Search -------------------------------------------------------------
  safe(function () {
    var dialog = $('#search'), openers = $$('[data-search]'), input = $('#search-input'), res = $('#search-results');
    if (!dialog || !input) return;
    var items = [], sel = -1, lastQ = '';
    function open() { dialog.classList.add('open'); dialog.setAttribute('aria-hidden', 'false'); input.value = ''; res.innerHTML = ''; sel = -1; setTimeout(function () { input.focus(); }, 40); }
    function close() { dialog.classList.remove('open'); dialog.setAttribute('aria-hidden', 'true'); }
    openers.forEach(function (b) { on(b, 'click', function (e) { e.preventDefault(); open(); }); });
    on(dialog, 'click', function (e) { if (e.target === dialog) close(); });
    on(input, 'keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
      else if (e.key === 'Enter' && sel > -1) { e.preventDefault(); location.href = ROOT + items[sel].u; }
    });
    on(doc, 'keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (e.key === 'Escape' && dialog.classList.contains('open')) close();
      else if ((e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(tag) && !(e.target && e.target.isContentEditable)) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); open(); }
    });
    function mark() { $$('a', res).forEach(function (a, i) { a.classList.toggle('sel', i === sel); }); }
    function run() {
      var q = input.value.trim().toLowerCase();
      if (q === lastQ) return; lastQ = q;
      if (!q) { res.innerHTML = ''; items = []; return; }
      fetch(ROOT + 'assets/search-index.json').then(function (r) { return r.json(); }).then(function (data) {
        items = data.filter(function (p) { return (p.t + ' ' + p.d).toLowerCase().indexOf(q) > -1; }).slice(0, 12);
        res.innerHTML = items.length ? items.map(function (p, i) {
          return '<a href="' + ROOT + p.u + '" class="' + (i === 0 ? 'sel' : '') + '"><b>' + p.t + '</b><span>' + p.d + '</span></a>';
        }).join('') : '<p class="empty">No results</p>';
        sel = items.length ? 0 : -1;
      }).catch(function () { res.innerHTML = '<p class="empty">Search unavailable</p>'; });
    }
    on(input, 'input', run);
  });

  // ---- Content protection (Level 4 deterrence: copy / right-click / keyboard) ----
  // Blocks right-click, copy/cut, text selection, common view-source & DevTools shortcuts.
  // Still allows form fields, contenteditable, and [data-allow-copy] zones.
  safe(function () {
    if (!PROTECT) return;
    var strong = doc.body.hasAttribute('data-protect'); // full lock on author's long-form pages
    function editable(t) {
      return t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable || (t.closest && t.closest('[data-allow-copy]')));
    }
    // Right-click, copy, cut, selectstart
    ['copy', 'cut', 'contextmenu', 'selectstart'].forEach(function (ev) {
      on(doc, ev, function (e) {
        if (!editable(e.target)) e.preventDefault();
      }, true);
    });
    // Image drag & save
    on(doc, 'dragstart', function (e) {
      if (e.target && (e.target.tagName === 'IMG' || e.target.closest('img'))) e.preventDefault();
    }, true);
    $$('img').forEach(function (i) {
      i.classList.add('protected');
      i.draggable = false;
      i.setAttribute('draggable', 'false');
    });
    // Keyboard blocks (global when PROTECT, stronger on data-protect pages)
    on(doc, 'keydown', function (e) {
      if (editable(e.target)) return;
      var k = (e.key || '').toLowerCase();
      var ctrl = e.ctrlKey || e.metaKey;
      var shift = e.shiftKey;
      // Always block: view-source, save, select-all (when strong), print can stay
      if (ctrl && (k === 'u' || k === 's' || k === 'c' || k === 'x' || k === 'a' || k === 'p')) {
        if (strong || k === 'u' || k === 's' || k === 'c' || k === 'x') {
          e.preventDefault();
          return false;
        }
      }
      // DevTools / inspect
      if (k === 'f12' || (ctrl && shift && (k === 'i' || k === 'j' || k === 'c' || k === 'k'))) {
        e.preventDefault();
        return false;
      }
    }, true);
    // Optional visual feedback class
    if (strong) root.classList.add('content-protected');
  });

  // ---- Print button (resume) ---------------------------------------------
  safe(function () { $$('[data-print]').forEach(function (b) { on(b, 'click', function () { window.print(); }); }); });

  // ---- External links ------------------------------------------------------
  safe(function () {
    $$('a[href^="http"]').forEach(function (a) {
      try { if (new URL(a.href).origin !== location.origin) { a.rel = 'noopener noreferrer'; if (!a.target) a.target = '_blank'; } } catch (e) {}
    });
    $$('.js-year').forEach(function (e) { e.textContent = new Date().getFullYear(); });
  });

  // ---- Home: intro splash + resume-last-portal ----------------------------
  safe(function () {
    if (!doc.body.classList.contains('home')) return;
    $$('.portal').forEach(function (a) { on(a, 'click', function () { store('bs_last_portal', a.getAttribute('href') + '|' + a.getAttribute('data-name')); }); });
    var last = store('bs_last_portal'), slot = $('#resume-slot');
    if (last && slot && last.indexOf('|') > 0) { var p = last.split('|'); slot.innerHTML = 'Welcome back — continue to <a href="' + p[0].replace(/"/g, '') + '"></a>'; slot.querySelector('a').textContent = p[1]; slot.hidden = false; }
    if (reduced || sess('bs_intro')) return;
    var el = doc.createElement('div'); el.className = 'intro'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="intro-mark"><span>B</span><span>.</span><span>M</span><span>.</span><span>S</span><span>.</span></div><div class="intro-name">Bhargavsinh Sisodiya</div><button type="button" class="intro-skip">Skip</button>';
    doc.body.appendChild(el);
    function end() { sess('bs_intro', '1'); el.classList.add('out'); setTimeout(function () { el.remove(); }, 800); }
    on($('.intro-skip', el), 'click', end); setTimeout(end, 2600);
  });

  // ---- Service worker + update toast --------------------------------------
  safe(function () {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    var toast = $('#toast');
    function ping() { if (!toast) return; toast.classList.add('show'); on($('button', toast), 'click', function () { var w = ping.w; if (w) w.postMessage({ type: 'SKIP_WAITING' }); else location.reload(); }); }
    on(window, 'load', function () {
      navigator.serviceWorker.register(ROOT + 'sw.js').then(function (reg) {
        if (reg.waiting) { ping.w = reg.waiting; ping(); }
        reg.addEventListener('updatefound', function () {
          var w = reg.installing;
          if (!w) return;
          w.addEventListener('statechange', function () { if (w.state === 'installed' && navigator.serviceWorker.controller) { ping.w = w; ping(); } });
        });
      }).catch(function () {});
    });
  });

})();
