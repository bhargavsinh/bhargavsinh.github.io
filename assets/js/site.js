/* BHARGAVSINH SISODIYA — Digital Universe · V18 · single site script.
   Features are independent and guarded: a failure in one never breaks the rest. */
(function () {
  'use strict';

  // ---- Config -------------------------------------------------------------
  var PROTECT = true;            // deterrence on author's original long-form pages (body[data-protect]); set false to disable
  var ROOT = document.documentElement.getAttribute('data-root') || '';
  var doc = document, root = doc.documentElement;

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
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
    var tick = false;
    function update() {
      tick = false;
      var h = doc.documentElement, max = h.scrollHeight - h.clientHeight, y = window.pageYOffset;
      if (bar) bar.style.width = (max > 0 ? Math.min(100, y / max * 100) : 0) + '%';
      if (tools) tools.classList.toggle('show', y > 500);
    }
    on(window, 'scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    update();
    on($('#to-top'), 'click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
  });

  // ---- Site search --------------------------------------------------------
  safe(function () {
    var dlg = $('#search'), input = $('#search-input'), res = $('#search-res'), openers = $$('[data-search]');
    if (!dlg || !input) return;
    var index = null, sel = -1, items = [];
    function load() {
      if (index) return Promise.resolve(index);
      return fetch(ROOT + 'assets/search-index.json').then(function (r) { return r.json(); }).then(function (j) { index = j; return j; }).catch(function () { index = []; return index; });
    }
    function norm(s) { return (s || '').toLowerCase().normalize('NFC'); }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;' }[c]; }); }
    function render(q) {
      var terms = norm(q).split(/\s+/).filter(Boolean), out = [];
      (index || []).forEach(function (p) {
        if (!terms.length) { out.push([0, p]); return; }
        var sc = 0, t = norm(p.t), h = norm(p.h), d = norm(p.d), k = norm(p.k);
        for (var i = 0; i < terms.length; i++) {
          var w = terms[i], s = 0;
          if (t.indexOf(w) > -1) s += 6; if (k.indexOf(w) > -1) s += 4; if (h.indexOf(w) > -1) s += 3; if (d.indexOf(w) > -1) s += 1;
          if (!s) { sc = 0; break; } sc += s;
        }
        if (sc) out.push([sc, p]);
      });
      out.sort(function (a, b) { return b[0] - a[0]; });
      items = out.slice(0, 12).map(function (x) { return x[1]; });
      sel = items.length ? 0 : -1;
      res.innerHTML = items.length ? items.map(function (p, i) {
        return '<a href="' + esc(ROOT + p.u) + '" class="' + (i === 0 ? 'sel' : '') + '"><em>' + esc(p.p) + '</em>' + esc(p.t) + '<small>' + esc((p.d || '').slice(0, 110)) + '</small></a>';
      }).join('') : '<div class="search-empty">No pages match “' + esc(q) + '”.</div>';
    }
    function open() { dlg.classList.add('open'); dlg.setAttribute('aria-hidden', 'false'); load().then(function () { render(input.value); }); setTimeout(function () { input.focus(); input.select(); }, 30); }
    function close() { dlg.classList.remove('open'); dlg.setAttribute('aria-hidden', 'true'); }
    function mark() { $$('a', res).forEach(function (a, i) { a.classList.toggle('sel', i === sel); if (i === sel) a.scrollIntoView({ block: 'nearest' }); }); }
    openers.forEach(function (b) { on(b, 'click', function (e) { e.preventDefault(); open(); }); });
    on(dlg, 'click', function (e) { if (e.target === dlg) close(); });
    on(input, 'input', function () { render(input.value); });
    on(input, 'keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
      else if (e.key === 'Enter' && sel > -1) { e.preventDefault(); location.href = ROOT + items[sel].u; }
    });
    on(doc, 'keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (e.key === 'Escape' && dlg.classList.contains('open')) close();
      else if ((e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(tag) && !(e.target && e.target.isContentEditable)) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); open(); }
    });
  });

  // ---- Tabs (ghostwriting) ------------------------------------------------
  safe(function () {
    var tabs = $$('.lang-tab'); if (!tabs.length) return;
    function pick(lang) {
      $$('.lang-pane').forEach(function (p) { p.classList.toggle('hidden', p.id !== 'content-' + lang); });
      tabs.forEach(function (t) { var a = t.getAttribute('data-arg') === lang; t.classList.toggle('gold', a); t.setAttribute('aria-selected', a ? 'true' : 'false'); t.tabIndex = a ? 0 : -1; });
    }
    tabs.forEach(function (t, i) {
      t.setAttribute('role', 'tab'); t.setAttribute('aria-controls', 'content-' + t.getAttribute('data-arg'));
      on(t, 'click', function () { pick(t.getAttribute('data-arg')); });
      on(t, 'keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!n) return;
        var nx = tabs[(i + n + tabs.length) % tabs.length]; nx.focus(); pick(nx.getAttribute('data-arg'));
      });
    });
    if (tabs[0].parentNode) tabs[0].parentNode.setAttribute('role', 'tablist');
    pick('en');
  });

  // ---- pwriter (7-layer prompt builder) ----------------------------------
  safe(function () {
    var raw = $('#raw-input'); if (!raw) return;
    var disp = $('#prompt-display'), st = $('#status-text'), wc = $('#word-count'), loader = $('#loader');
    var IDLE = 'Awaiting parameters to construct 7-Layer Architecture...';
    function status(t) { if (st) st.textContent = 'Status: ' + t; }
    function val(id, d) { var e = $('#' + id); return (e && e.value) || d; }
    var actions = {
      clearInput: function () { raw.value = ''; disp.textContent = IDLE; disp.classList.remove('ready'); status('Idle'); wc.textContent = 'Est. Length: 0 Words'; },
      generateDeepPrompt: function () {
        var text = raw.value.trim();
        if (!text) { status('Please enter your core idea or parameters first.'); raw.focus(); return; }
        loader && loader.classList.remove('hidden'); status('Synthesizing...');
        setTimeout(function () {
          var p = [
            '=== 7-LAYER DEEP PROMPT ARCHITECTURE ===', '',
            '[1. ROLE]', 'You are an expert specialist optimized for: ' + val('target', 'General AI') + '.', '',
            '[2. CONTEXT]', text, '',
            '[3. OBJECTIVE]', 'Produce a high-quality, complete response that fully addresses the context above.', '',
            '[4. TONE]', 'Adopt a ' + val('tone', 'Professional') + ' tone throughout.', '',
            '[5. FORMAT]', 'Structure the output as: ' + val('format', 'Structured') + '.', '',
            '[6. CONSTRAINTS]', '- Be accurate and specific.', '- Avoid filler and unsupported claims.', '- If information is uncertain, state assumptions clearly.', '',
            '[7. QUALITY BAR]', 'Prioritize clarity, usefulness, and completeness. End with a brief self-check of whether the objective was met.', '',
            '=== END ARCHITECTURE ==='
          ].join('\n');
          disp.textContent = p; disp.classList.add('ready');
          wc.textContent = 'Est. Length: ' + p.trim().split(/\s+/).length + ' Words';
          status('Ready'); loader && loader.classList.add('hidden');
        }, reduced ? 0 : 500);
      },
      copyToClipboard: function () {
        var t = disp.textContent || '';
        if (!t || t === IDLE) { status('Nothing to copy yet. Generate a prompt first.'); return; }
        function ok() { status('Copied to clipboard'); }
        function fb() { var ta = doc.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.className = 'hp'; doc.body.appendChild(ta); ta.select(); try { doc.execCommand('copy'); ok(); } catch (e) { status('Copy failed — select the text manually'); } doc.body.removeChild(ta); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fb); else fb();
      }
    };
    $$('[data-action]').forEach(function (b) { var f = actions[b.getAttribute('data-action')]; if (f) on(b, 'click', f); });
  });

  // ---- Contact form -------------------------------------------------------
  safe(function () {
    var form = $('#appointment-form'); if (!form) return;
    var sel = $('#purpose-select'), other = $('#other-purpose-div'), oin = $('#specific-purpose-input');
    on(sel, 'change', function () { var o = sel.value === 'Other'; other.classList.toggle('hidden', !o); oin.required = o; if (!o) oin.value = ''; });
    var date = form.querySelector('input[type="date"]'); if (date) date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    var okBox = $('#success-message'), errBox = $('#error-message'), btn = $('#submit-button');
    if (okBox) okBox.classList.add('hidden'); if (errBox) errBox.classList.add('hidden');
    on(form, 'submit', function (e) {
      if (!window.fetch || !window.FormData) return;
      var hp = form.querySelector('[name="_gotcha"]'); if (hp && hp.value) { e.preventDefault(); return; }
      var last = parseInt(sess('bs_form_ts') || '0', 10);
      if (Date.now() - last < 8000) { e.preventDefault(); if (errBox) { errBox.classList.remove('hidden'); errBox.textContent = errBox.textContent || 'Please wait a few seconds before submitting again.'; } return; }
      e.preventDefault(); sess('bs_form_ts', String(Date.now()));
      var label = btn.innerHTML; btn.disabled = true; btn.textContent = '…'; errBox.classList.add('hidden');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); form.classList.add('hidden'); okBox.classList.remove('hidden'); okBox.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }); })
        .catch(function () { errBox.classList.remove('hidden'); btn.disabled = false; btn.innerHTML = label; });
    });
  });

  // ---- Genealogy filter + jump -------------------------------------------
  safe(function () {
    var box = $('#gen-q'); if (!box) return;
    var lines = $$('.gl'), cnt = $('#gen-count'), total = lines.filter(function (l) { return l.classList.contains('n'); }).length;
    function norm(s) { return s.toLowerCase().normalize('NFC'); }
    var cache = lines.map(function (l) { return norm(l.textContent); });
    function run() {
      var q = norm(box.value.trim()), shown = 0;
      if (/^\d+$/.test(q)) {
        lines.forEach(function (l) { l.hidden = false; });
        var t = $('.gl[data-n="' + q + '"]');
        if (t) { t.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }); t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash'); }
        cnt.textContent = t ? 'Jumped to #' + q : 'No entry #' + q; return;
      }
      lines.forEach(function (l, i) { var m = !q || cache[i].indexOf(q) > -1; l.hidden = !m; if (m && l.classList.contains('n')) shown++; });
      cnt.textContent = q ? shown + ' of ' + total + ' entries' : total + ' entries';
    }
    on(box, 'input', run); run();
  });

  // ---- Publications filter ----------------------------------------------
  safe(function () {
    var q = $('#pub-q'); if (!q) return;
    var lang = $('#pub-lang'), st = $('#pub-status'), cnt = $('#pub-count'), cards = $$('.card.pub'), groups = $$('[data-group]');
    function norm(s) { return (s || '').toLowerCase().normalize('NFC'); }
    function run() {
      var t = norm(q.value.trim()), n = 0;
      cards.forEach(function (c) {
        var ok = (!t || (c.getAttribute('data-text') || '').indexOf(t) > -1) && (!lang.value || c.getAttribute('data-lang') === lang.value) && (!st.value || c.getAttribute('data-status') === st.value);
        c.hidden = !ok; if (ok) n++;
      });
      groups.forEach(function (g) { g.hidden = !$$('.card.pub:not([hidden])', g).length; });
      cnt.textContent = n + (n === 1 ? ' publication' : ' publications');
    }
    ['input', 'change'].forEach(function (e) { on(q, e, run); on(lang, e, run); on(st, e, run); }); run();
  });

  // ---- Content protection (deterrence only; see README) -------------------
  safe(function () {
    if (!PROTECT || !doc.body.hasAttribute('data-protect')) return;
    function editable(t) { return t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable || (t.closest && t.closest('[data-allow-copy]'))); }
    ['copy', 'cut', 'contextmenu'].forEach(function (ev) { on(doc, ev, function (e) { if (!editable(e.target)) e.preventDefault(); }, true); });
    on(doc, 'dragstart', function (e) { if (e.target && e.target.tagName === 'IMG') e.preventDefault(); }, true);
    $$('img').forEach(function (i) { i.classList.add('protected'); i.draggable = false; });
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
    if (last && slot && last.indexOf('|') > 0) { var p = last.split('|'); slot.innerHTML = 'Welcome back — continue to <a href="' + p[0].replace(/\"/g, '') + '"></a>'; slot.querySelector('a').textContent = p[1]; slot.hidden = false; }
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
        function watch(w) { w.addEventListener('statechange', function () { if (w.state === 'installed' && navigator.serviceWorker.controller) { ping.w = w; ping(); } }); }
        if (reg.waiting && navigator.serviceWorker.controller) { ping.w = reg.waiting; ping(); }
        reg.addEventListener('updatefound', function () { if (reg.installing) watch(reg.installing); });
      }).catch(function () {});
      var reloaded = false, had = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', function () { if (reloaded || !had) return; reloaded = true; location.reload(); });
    });
  });

  // ---- Footer button chart (loads companion script once) ------------------
  safe(function () {
    if (doc.querySelector('script[data-footer-chart]')) return;
    var s = doc.createElement('script');
    s.src = ROOT + 'assets/js/footer-chart.js?v=19.0.5';
    s.defer = true;
    s.setAttribute('data-footer-chart', '1');
    doc.body.appendChild(s);
  });
})();
