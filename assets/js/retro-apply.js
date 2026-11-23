/* Early-2000s shell + L4 helper. Applies classic chrome when page lacks .page-wrap. */
(function () {
  'use strict';
  if (window.__RETRO_APPLY__) return;
  window.__RETRO_APPLY__ = true;

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

  function apply() {
    var r = root();
    ensureCss(r + 'assets/css/retro-2000s.css?v=20.3.0');
    ensureCss(r + 'assets/css/protect-l4.css?v=18.1.3');
    document.documentElement.setAttribute('data-retro', '1');
    if (document.body) {
      document.body.setAttribute('data-protect', '');
      document.body.classList.add('is-protected', 'l4-secure', 'retro-body');
    }

    if (document.querySelector('.page-wrap')) return;
    if (document.getElementById('retro-topbar')) return;

    var bar = document.createElement('div');
    bar.id = 'retro-topbar';
    bar.innerHTML =
      '<div class="banner" style="margin:0">' +
      '<h1 style="font-size:22px;margin:0">BHARGAVSINH SISODIYA</h1>' +
      '<div class="tagline">Digital Heir of Mewar · Early 2000s Edition</div></div>' +
      '<div class="marquee-bar"><marquee scrollamount="4">Welcome to My Homepage — Preserving history through sovereign code —</marquee></div>' +
      '<div class="nav-bar">' +
      '<a class="btn" href="' + r + 'index.html">Home</a> ' +
      '<a class="btn" href="' + r + 'vanshavali.html">Vanshavali</a> <span class="blink-new">NEW!</span> ' +
      '<a class="btn" href="' + r + 'resume.html">Resume</a> ' +
      '<a class="btn" href="' + r + 'archives.html">Archives</a> ' +
      '<a class="btn" href="' + r + 'contact.html">Contact</a></div>';
    document.body.insertBefore(bar, document.body.firstChild);

    var foot = document.createElement('div');
    foot.className = 'footer';
    foot.id = 'retro-footer';
    foot.innerHTML =
      '<div>© 2026 BHARGAVSINH SISODIYA · Last Updated: 23 Nov 2026</div>' +
      '<div class="counter-box" style="display:inline-block;margin:6px auto">You are visitor No. 0004000</div>' +
      '<div class="ie-note">Best viewed in Internet Explorer 6.0 at 800×600 resolution</div>';
    document.body.appendChild(foot);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
