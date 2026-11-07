/* BHARGAVSINH SISODIYA — Digital Universe · V18 · single site script.
   Features are independent and guarded: a failure in one never breaks the rest. */
(function () {
  'use strict';

  // ---- Config -------------------------------------------------------------
  var PROTECT = true;            // content protection + soft DRM deterrence; set false to disable globally
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

  // PLACEHOLDER_REST
})();
