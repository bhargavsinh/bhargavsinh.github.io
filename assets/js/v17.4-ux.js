/**
 * V17.4 — UX: keep V17.3 helpers + PWA install hint + load search
 * No file downloads.
 */
(function () {
  "use strict";

  function assetPrefix() {
    var path = (location.pathname || "").replace(/\\/g, "/");
    if (path.indexOf("/Book-Publications-Reader/") !== -1 ||
        path.indexOf("/HR-Recruiter/") !== -1 ||
        path.indexOf("/Visitor/") !== -1) {
      return "../";
    }
    return "";
  }

  function loadScript(src) {
    if (document.querySelector('script[src*="' + src.split("/").pop() + '"]')) return;
    var s = document.createElement("script");
    s.src = src;
    s.defer = true;
    document.body.appendChild(s);
  }

  function loadStyle(href) {
    if (document.querySelector('link[href*="' + href.split("/").pop().split("?")[0] + '"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  function injectProgressAndTop() {
    if (document.querySelector(".reading-progress")) return;
    var bar = document.createElement("div");
    bar.className = "reading-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = "↑";
    document.body.appendChild(btn);
    function onScroll() {
      var doc = document.documentElement;
      var scrollTop = window.pageYOffset || doc.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      bar.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + "%";
      if (scrollTop > 400) btn.classList.add("visible");
      else btn.classList.remove("visible");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function preventImageDrag() {
    document.addEventListener("dragstart", function (e) {
      if (e.target && e.target.tagName === "IMG") e.preventDefault();
    }, { capture: true });
  }

  function registerSWUpdateToast() {
    if (!("serviceWorker" in navigator)) return;
    var refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg) return;
      function showToast() {
        if (document.querySelector(".sw-update-toast")) return;
        var toast = document.createElement("div");
        toast.className = "sw-update-toast";
        toast.setAttribute("role", "status");
        toast.innerHTML = "<span>New version available</span><button type=\"button\">Refresh</button>";
        document.body.appendChild(toast);
        requestAnimationFrame(function () { toast.classList.add("show"); });
        toast.querySelector("button").addEventListener("click", function () {
          if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
          else window.location.reload();
        });
      }
      if (reg.waiting) showToast();
      reg.addEventListener("updatefound", function () {
        var worker = reg.installing;
        if (!worker) return;
        worker.addEventListener("statechange", function () {
          if (worker.state === "installed" && navigator.serviceWorker.controller) showToast();
        });
      });
    }).catch(function () {});
    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    }
  }

  function pwaInstallHint() {
    var key = "bs_pwa_hint_dismissed";
    try { if (sessionStorage.getItem(key)) return; } catch (e) {}
    var standalone = window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (standalone) return;

    var deferred = null;
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferred = e;
      if (document.querySelector(".pwa-install-hint")) return;
      var hint = document.createElement("div");
      hint.className = "pwa-install-hint";
      hint.setAttribute("role", "status");
      hint.innerHTML =
        "<span>Install this site on your device</span>" +
        "<button type=\"button\" class=\"pwa-install\">Install</button>" +
        "<button type=\"button\" class=\"pwa-dismiss\">Not now</button>";
      document.body.appendChild(hint);
      requestAnimationFrame(function () { hint.classList.add("show"); });
      hint.querySelector(".pwa-install").addEventListener("click", function () {
        if (!deferred) return;
        deferred.prompt();
        deferred.userChoice.finally(function () {
          deferred = null;
          hint.remove();
        });
      });
      hint.querySelector(".pwa-dismiss").addEventListener("click", function () {
        try { sessionStorage.setItem(key, "1"); } catch (err) {}
        hint.remove();
      });
    });
  }

  function ensureSkipTarget() {
    var main = document.querySelector("main");
    if (main && !main.id) main.id = "main-content";
  }

  function lazyImages() {
    document.querySelectorAll("img:not([loading])").forEach(function (img) {
      if (img.closest(".portal-bar, .ps-brand, .bs-intro")) return;
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
    });
  }

  function init() {
    var p = assetPrefix();
    loadStyle(p + "assets/css/v17.3-enhancements.css?v=17.4");
    loadStyle(p + "assets/css/v17.4-enhancements.css?v=17.4");
    loadScript(p + "assets/js/site-search.js?v=17.4");
    injectProgressAndTop();
    preventImageDrag();
    registerSWUpdateToast();
    pwaInstallHint();
    ensureSkipTarget();
    lazyImages();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
