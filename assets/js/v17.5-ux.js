/** V17.5 UX — skeleton search except index; image protect; PWA */
(function () {
  "use strict";
  function isIndex() {
    var path = (location.pathname || "").replace(/\\/g, "/");
    if (path === "/" || path === "") return true;
    var file = path.split("/").pop() || "";
    return file === "index.html" || file === "";
  }
  function assetPrefix() {
    var path = (location.pathname || "").replace(/\\/g, "/");
    if (path.indexOf("/Book-Publications-Reader/") !== -1 || path.indexOf("/HR-Recruiter/") !== -1 || path.indexOf("/Visitor/") !== -1) return "../";
    return "";
  }
  function loadScript(src) {
    if (document.querySelector('script[src*="' + src.split("/").pop().split("?")[0] + '"]')) return;
    var s = document.createElement("script"); s.src = src; s.defer = true; document.body.appendChild(s);
  }
  function loadStyle(href) {
    var key = href.split("/").pop().split("?")[0];
    if (document.querySelector('link[href*="' + key + '"]')) return;
    var l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l);
  }
  function protectImages() {
    document.querySelectorAll("img").forEach(function (img) {
      img.classList.add("img-protected");
      img.setAttribute("draggable", "false");
      if (!img.getAttribute("loading") && !img.closest(".portal-bar, .ps-brand, .bs-intro")) img.setAttribute("loading", "lazy");
      if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");
    });
    document.addEventListener("dragstart", function (e) {
      if (e.target && e.target.tagName === "IMG") e.preventDefault();
    }, { capture: true });
  }
  function injectProgressAndTop() {
    if (document.querySelector(".reading-progress")) return;
    var bar = document.createElement("div"); bar.className = "reading-progress"; bar.setAttribute("aria-hidden", "true"); document.body.appendChild(bar);
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "back-to-top"; btn.setAttribute("aria-label", "Back to top"); btn.innerHTML = "↑"; document.body.appendChild(btn);
    function onScroll() {
      var doc = document.documentElement;
      var scrollTop = window.pageYOffset || doc.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      bar.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + "%";
      if (scrollTop > 400) btn.classList.add("visible"); else btn.classList.remove("visible");
    }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }
  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    var refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () { if (refreshing) return; refreshing = true; window.location.reload(); });
    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg) return;
      function showToast() {
        if (document.querySelector(".sw-update-toast")) return;
        var toast = document.createElement("div"); toast.className = "sw-update-toast"; toast.setAttribute("role", "status");
        toast.innerHTML = "<span>New version available</span><button type=\"button\">Refresh</button>";
        document.body.appendChild(toast);
        requestAnimationFrame(function () { toast.classList.add("show"); });
        toast.querySelector("button").addEventListener("click", function () {
          if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" }); else window.location.reload();
        });
      }
      if (reg.waiting) showToast();
      reg.addEventListener("updatefound", function () {
        var worker = reg.installing; if (!worker) return;
        worker.addEventListener("statechange", function () {
          if (worker.state === "installed" && navigator.serviceWorker.controller) showToast();
        });
      });
    }).catch(function () {});
    if (!navigator.serviceWorker.controller) navigator.serviceWorker.register("/sw.js").catch(function () {});
  }
  function init() {
    var p = assetPrefix();
    loadStyle(p + "assets/css/v17.3-enhancements.css?v=17.5");
    loadStyle(p + "assets/css/v17.4-enhancements.css?v=17.5");
    loadStyle(p + "assets/css/v17.5-enhancements.css?v=17.5");
    if (!isIndex()) loadScript(p + "assets/js/site-search.js?v=17.5");
    protectImages(); injectProgressAndTop(); registerSW();
    var main = document.querySelector("main"); if (main && !main.id) main.id = "main-content";
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
