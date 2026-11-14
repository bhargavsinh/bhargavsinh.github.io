/* Darbar Gate loader — 1.2s to 1.8s, session-once, skip control. */
(function () {
  'use strict';
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  } catch (e0) {}

  var KEY = 'bs_darbar_gate';
  try {
    if (sessionStorage.getItem(KEY) === '1') return;
  } catch (e1) {}

  // Avoid double splash with legacy intro
  try { sessionStorage.setItem('bs_intro', '1'); } catch (e2) {}

  var ms = 1200 + Math.floor(Math.random() * 601); // 1.2s – 1.8s

  var gate = document.createElement('div');
  gate.id = 'darbar-gate';
  gate.setAttribute('role', 'status');
  gate.setAttribute('aria-live', 'polite');
  gate.setAttribute('aria-label', "Welcome to Bhargavsinh Sisodiya's portfolio. Loading.");
  gate.style.setProperty('--dg-ms', ms + 'ms');
  gate.innerHTML =
    '<svg class="dg-arch" viewBox="0 0 320 220" aria-hidden="true" focusable="false">' +
    '<rect x="20" y="40" width="28" height="160" fill="#3a3229"/>' +
    '<rect x="272" y="40" width="28" height="160" fill="#3a3229"/>' +
    '<path d="M48 40 H272 V70 Q160 8 48 70 Z" fill="#C6A15B" opacity="0.9"/>' +
    '<path d="M70 200 V95 Q160 35 250 95 V200" fill="none" stroke="#C6A15B" stroke-width="3"/>' +
    '<rect x="145" y="150" width="30" height="50" rx="2" fill="#581F2A"/>' +
    '<circle cx="160" cy="175" r="3" fill="#D4AF70"/>' +
    '<path d="M40 30 L50 18 L60 30 M260 30 L270 18 L280 30" fill="none" stroke="#D4AF70" stroke-width="2"/>' +
    '</svg>' +
    '<p class="dg-title">Welcome to Bhargavsinh Sisodiya\'s portfolio</p>' +
    '<p class="dg-sub">Preparing your visit — projects, publications and heritage.</p>' +
    '<div class="dg-bar" aria-hidden="true"><i></i></div>' +
    '<button type="button" class="dg-skip">Enter now</button>';

  function mount() {
    if (!document.body) return;
    document.body.classList.add('darbar-locked');
    document.body.appendChild(gate);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  var closed = false;
  function close() {
    if (closed) return;
    closed = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e3) {}
    gate.classList.add('is-out');
    document.body.classList.remove('darbar-locked');
    setTimeout(function () {
      if (gate.parentNode) gate.parentNode.removeChild(gate);
    }, 600);
  }

  gate.addEventListener('click', function (ev) {
    if (ev.target && ev.target.classList && ev.target.classList.contains('dg-skip')) close();
  });
  document.addEventListener('keydown', function onKey(ev) {
    if (ev.key === 'Escape' || ev.key === 'Enter') {
      close();
      document.removeEventListener('keydown', onKey);
    }
  });

  setTimeout(close, ms);
})();
