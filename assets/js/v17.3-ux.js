/**
 * V17.3 — Shared UX helpers
 * - Reading progress bar
 * - Back-to-top
 * - SW update toast
 * - Image drag deterrence
 * - Skip-link focus assist
 */
(function () {
  "use strict";

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
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + "%";
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
      if (e.target && e.target.tagName === "IMG") {
        e.preventDefault();
      }
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
        toast.innerHTML =
          "<span>New version available</span>" +
          '<button type="button">Refresh</button>';
        document.body.appendChild(toast);
        requestAnimationFrame(function () {
          toast.classList.add("show");
        });
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
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            showToast();
          }
        });
      });
    }).catch(function () { /* ignore */ });

    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    }
  }

  function ensureSkipTarget() {
    var main = document.querySelector("main");
    if (main && !main.id) main.id = "main-content";
  }

  function init() {
    injectProgressAndTop();
    preventImageDrag();
    registerSWUpdateToast();
    ensureSkipTarget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
