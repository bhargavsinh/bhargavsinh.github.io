/**
 * V17.0 — Portal page shell
 * Loads portal-specific header.html + footer.html partials,
 * then activates security + mobile drawer.
 */
(function () {
  "use strict";
  var path = (location.pathname || "").replace(/\\/g, "/");
  var accentClass = "portal-visitor";
  if (path.indexOf("/Book-Publications-Reader/") !== -1) {
    accentClass = "portal-books";
  } else if (path.indexOf("/HR-Recruiter/") !== -1) {
    accentClass = "portal-hr";
  }
  var partialBase = "partials/";
  function loadPartial(url) {
    return fetch(url, { credentials: "same-origin", cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("Failed " + url);
        return r.text();
      });
  }
  function stripLegacyChrome() {
    ["header-container", "footer-container", "site-nav", "mobile-nav",
      "portal-header", "portal-footer", "portal-mobile-nav"
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
    document.querySelectorAll(".site-footer, .portal-bar, .portal-drawer, .portal-footer").forEach(function (el) {
      el.remove();
    });
  }
  function injectTheme() {
    document.body.classList.add(accentClass);
    if (!document.querySelector('link[href*="portal-common"]')) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../assets/css/portal-common.css?v=17.0";
      document.head.appendChild(link);
    }
    if (!document.getElementById("v16-theme-overrides")) {
      var s = document.createElement("style");
      s.id = "v16-theme-overrides";
      s.textContent = [
        "h1,h1.font-yatra,.font-yatra.text-divine-gold,.text-divine-gold,",
        "h1[class*=text-amber],h1[class*=text-divine]{color:#fff!important}",
        ".text-amber-300,.text-amber-400,.text-divine-gold,",
        "[class*=text-amber-3],[class*=text-amber-4],[class*=text-divine]{color:#E50914!important}",
        "h1.text-amber-400,h1.text-divine-gold{color:#fff!important}",
        "body{background:#0B0B0F!important;color:#fff}",
        "[class*=border-amber]{border-color:#303038!important}",
        "a.bg-gradient-to-r,.bg-gradient-to-r{background:#E50914!important;background-image:none!important;color:#fff!important}"
      ].join("");
      document.head.appendChild(s);
      setTimeout(function () { document.head.appendChild(s); }, 400);
    }
  }
  function loadSecurity() {
    if (document.querySelector('script[src*="portal-security"]')) return;
    var sc = document.createElement("script");
    sc.src = "../assets/js/portal-security.js?v=17.0";
    sc.defer = true;
    document.body.appendChild(sc);
  }
  function init() {
    injectTheme();
    stripLegacyChrome();
    Promise.all([
      loadPartial(partialBase + "header.html"),
      loadPartial(partialBase + "footer.html")
    ]).then(function (parts) {
      document.body.insertAdjacentHTML("afterbegin", parts[0]);
      document.body.insertAdjacentHTML("beforeend", parts[1]);
      loadSecurity();
    }).catch(function (err) {
      console.warn("Portal partials load failed, using fallback nav", err);
      document.body.insertAdjacentHTML("afterbegin",
        '<header class="portal-bar"><div class="portal-bar-inner">' +
        '<a href="../index.html" class="portal-brand">BHARGAV<span>SINH</span></a>' +
        '<a href="../index.html" class="portal-switch">Switch Portal</a></div></header>');
      loadSecurity();
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
