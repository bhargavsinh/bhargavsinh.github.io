/* Transform site footers into a button chart. Paths resolve from data-root or depth. */
(function () {
  'use strict';
  function rootPrefix() {
    var html = document.documentElement;
    var dr = html.getAttribute('data-root');
    if (dr === '' || dr === '.') return '';
    if (dr && dr.length) return dr.endsWith('/') ? dr : dr + '/';
    // infer from path depth
    var path = location.pathname.replace(/\\/index\\.html$/i, '/');
    var parts = path.split('/').filter(Boolean);
    // file pages: /Visitor/about.html → one level
    if (!/\\/$/.test(path) && parts.length) {
      // last segment is file
      parts = parts.slice(0, -1);
    }
    if (!parts.length) return '';
    return parts.map(function () { return '../'; }).join('');
  }

  function build(pref) {
    function u(p) { return pref + p; }
    var home = pref ? pref + 'index.html' : 'index.html';
    // absolute-style pages
    if (location.pathname.indexOf('/404') !== -1 || location.pathname.indexOf('/offline') !== -1) {
      pref = '/';
      home = '/index.html';
      u = function (p) { return '/' + p; };
    }
    return (
      '<div class="foot-in foot-chart">' +
      '<div class="foot-brand">' +
      '<a class="brand" href="' + home + '" aria-label="BHARGAVSINH SISODIYA — home">' +
      '<img src="' + pref + 'assets/images/brand/brand-mark-64.webp" srcset="' + pref + 'assets/images/brand/brand-mark-64.webp 1x, ' + pref + 'assets/images/brand/brand-mark-128.webp 2x" alt="" width="34" height="34">' +
      '<span>BHARGAV<b>SINH</b></span></a>' +
      '<p>Heritage in Memory. Knowledge in Creation.</p></div>' +
      '<div class="foot-groups">' +
      '<div class="foot-group"><h4>Explore</h4><ul class="foot-btns">' +
      '<li><a href="' + home + '">Home</a></li>' +
      '<li><a href="' + u('about/') + '">About</a></li>' +
      '<li><a href="' + u('projects/') + '">Projects</a></li>' +
      '<li><a href="' + u('publications/') + '">Publications</a></li>' +
      '<li><a href="' + u('research/') + '">Research</a></li>' +
      '<li><a href="' + u('contact/') + '">Contact</a></li>' +
      '</ul></div>' +
      '<div class="foot-group"><h4>Portals</h4><ul class="foot-btns">' +
      '<li><a href="' + u('Visitor/Visitindex.html') + '">Visitor</a></li>' +
      '<li><a href="' + u('HR-Recruiter/HRRindex.html') + '">HR Recruiter</a></li>' +
      '<li><a href="' + u('Book-Publications-Reader/BPindex.html') + '">Books</a></li>' +
      '</ul></div>' +
      '<div class="foot-group"><h4>Legal</h4><ul class="foot-btns">' +
      '<li><a href="' + u('Visitor/policy-center.html') + '">Policy Center</a></li>' +
      '<li><a href="' + u('Visitor/privacy-policy.html') + '">Privacy</a></li>' +
      '<li><a href="' + u('Visitor/termsofuse.html') + '">Terms</a></li>' +
      '<li><a href="' + u('Visitor/disclaimer.html') + '">Disclaimer</a></li>' +
      '<li><a href="' + u('Visitor/grievance.html') + '">Grievance</a></li>' +
      '<li><a href="' + u('Visitor/copyright-policy.html') + '">Copyright</a></li>' +
      '</ul></div>' +
      '<div class="foot-group"><h4>Site</h4><ul class="foot-btns">' +
      '<li><a href="' + u('sitemap.html') + '">Sitemap</a></li>' +
      '<li><a href="' + u('changelog.html') + '">Changelog</a></li>' +
      '<li><a href="' + u('Visitor/contact.html') + '">Contact form</a></li>' +
      '</ul></div>' +
      '</div></div>' +
      '<div class="foot-base"><span>© <span class="js-year">' + new Date().getFullYear() + '</span> BHARGAVSINH SISODIYA</span><span>V19.0.5</span></div>'
    );
  }

  function run() {
    var foot = document.querySelector('footer.foot');
    if (!foot || foot.getAttribute('data-chart') === '1') return;
    var pref = rootPrefix();
    foot.innerHTML = build(pref);
    foot.setAttribute('data-chart', '1');
    foot.setAttribute('data-v', '19.0.5');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
