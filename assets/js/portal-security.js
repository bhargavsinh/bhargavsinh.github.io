/** V17.5 — Strengthened client-side content + image deterrence (static site limits apply) */
(function () {
  "use strict";
  function hardenLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(function (a) {
      try {
        var u = new URL(a.href, location.href);
        if (u.origin !== location.origin) {
          a.setAttribute("rel", "noopener noreferrer nofollow");
          if (!a.target) a.setAttribute("target", "_blank");
        }
      } catch (e) {}
    });
  }
  function hardenForms() {
    document.querySelectorAll("form").forEach(function (form) {
      form.querySelectorAll("input, textarea").forEach(function (el) {
        el.addEventListener("input", function () { if (el.value) el.value = el.value.replace(/\0/g, ""); });
      });
      form.addEventListener("submit", function (e) {
        var hp = form.querySelector('[name="website_url"], .js-honeypot');
        if (hp && hp.value) { e.preventDefault(); return false; }
        try {
          var key = "bs_form_ts"; var last = parseInt(sessionStorage.getItem(key) || "0", 10); var now = Date.now();
          if (now - last < 8000) { e.preventDefault(); alert("Please wait a few seconds before submitting again."); return false; }
          sessionStorage.setItem(key, String(now));
        } catch (err) {}
      });
    });
  }
  function ensureHoneypot() {
    document.querySelectorAll("form").forEach(function (form) {
      if (form.querySelector(".js-honeypot")) return;
      var wrap = document.createElement("div");
      wrap.className = "js-honeypot"; wrap.setAttribute("aria-hidden", "true");
      wrap.style.cssText = "position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden;";
      wrap.innerHTML = '<label>Leave blank<input type="text" name="website_url" tabindex="-1" autocomplete="off"></label>';
      form.appendChild(wrap);
    });
  }
  function frameGuard() {
    try { if (window.top !== window.self) window.top.location = window.self.location; }
    catch (e) { document.body.style.display = "none"; }
  }
  function ensureSecurityMeta() {
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) return;
    var el = document.createElement("meta");
    el.setAttribute("http-equiv", "Content-Security-Policy");
    el.setAttribute("content", "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https:; object-src 'none'; upgrade-insecure-requests");
    document.head.appendChild(el);
  }
  function markActiveNav() {
    var file = (location.pathname.split("/").pop() || "").toLowerCase();
    document.querySelectorAll(".portal-nav a, .portal-drawer-links a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
      if (href && href === file) { a.classList.add("active"); a.setAttribute("aria-current", "page"); }
    });
  }
  function initDrawer() {
    var toggle = document.getElementById("portal-menu-toggle");
    var drawer = document.getElementById("portal-mobile-nav");
    var closeBtn = document.getElementById("portal-drawer-close");
    if (!toggle || !drawer) return;
    function open() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); toggle.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; }
    function close() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); toggle.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
    toggle.addEventListener("click", open);
    closeBtn && closeBtn.addEventListener("click", close);
    drawer.addEventListener("click", function (e) { if (e.target === drawer) close(); });
    drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) close(); });
  }
  function fillYears() {
    document.querySelectorAll(".js-year").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }
  function contentProtection() {
    document.addEventListener("contextmenu", function (e) { e.preventDefault(); }, { capture: true });
    document.addEventListener("copy", function (e) { e.preventDefault(); }, { capture: true });
    document.addEventListener("cut", function (e) { e.preventDefault(); }, { capture: true });
    document.addEventListener("selectstart", function (e) {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
    }, { capture: true });
    document.addEventListener("keydown", function (e) {
      var k = (e.key || "").toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === "s" || k === "u" || k === "p")) e.preventDefault();
      if (e.key === "F12") e.preventDefault();
    }, { capture: true });
  }
  function imageProtection() {
    document.querySelectorAll("img").forEach(function (img) {
      img.setAttribute("draggable", "false");
      img.classList.add("img-protected");
      img.style.webkitTouchCallout = "none";
      img.style.userSelect = "none";
    });
    document.addEventListener("dragstart", function (e) {
      if (e.target && e.target.tagName === "IMG") e.preventDefault();
    }, { capture: true });
  }
  function init() {
    frameGuard(); ensureSecurityMeta(); hardenLinks(); ensureHoneypot(); hardenForms();
    markActiveNav(); initDrawer(); fillYears(); contentProtection(); imageProtection();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
