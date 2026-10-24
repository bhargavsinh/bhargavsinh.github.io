/**
 * V17.5 — Portal page shell
 */
(function () {
  "use strict";
  var path = (location.pathname || "").replace(/\\/g, "/");
  var accentClass = "portal-visitor";
  if (path.indexOf("/Book-Publications-Reader/") !== -1) accentClass = "portal-books";
  else if (path.indexOf("/HR-Recruiter/") !== -1) accentClass = "portal-hr";
  var partialBase = "partials/";
  function loadPartial(url) {
    return fetch(url, { credentials: "same-origin", cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("Failed " + url); return r.text(); });
  }
  function injectV175() {
    [["v17.3-enhancements", "../assets/css/v17.3-enhancements.css?v=17.5"],
     ["v17.4-enhancements", "../assets/css/v17.4-enhancements.css?v=17.5"],
     ["v17.5-enhancements", "../assets/css/v17.5-enhancements.css?v=17.5"]].forEach(function (pair) {
      if (!document.querySelector('link[href*="' + pair[0] + '"]')) {
        var l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = pair[1];
        document.head.appendChild(l);
      }
    });
    if (!document.querySelector('script[src*="v17.5-ux"]')) {
      var s = document.createElement("script");
      s.src = "../assets/js/v17.5-ux.js?v=17.5";
      s.defer = true;
      document.body.appendChild(s);
    }
    if (!document.querySelector(".skip-link")) {
      var a = document.createElement("a");
      a.className = "skip-link";
      a.href = "#main-content";
      a.textContent = "Skip to content";
      document.body.insertBefore(a, document.body.firstChild);
    }
  }
  function injectTheme() {
    document.body.classList.add(accentClass);
    if (!document.querySelector('link[href*="portal-common"]')) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../assets/css/portal-common.css?v=17.5";
      document.head.appendChild(link);
    }
  }
  function loadSecurity() {
    if (document.querySelector('script[src*="portal-security"]')) return;
    var sc = document.createElement("script");
    sc.src = "../assets/js/portal-security.js?v=17.5";
    sc.defer = true;
    document.body.appendChild(sc);
  }
  function init() {
    injectTheme();
    injectV175();
    if (!document.querySelector(".portal-bar")) {
      Promise.all([loadPartial(partialBase + "header.html"), loadPartial(partialBase + "footer.html")])
        .then(function (parts) {
          document.body.insertAdjacentHTML("afterbegin", parts[0]);
          document.body.insertAdjacentHTML("beforeend", parts[1]);
          loadSecurity();
        }).catch(function () { loadSecurity(); });
    } else {
      loadSecurity();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
