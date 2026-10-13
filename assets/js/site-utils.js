/**
 * V17.0 — Site-wide UX helpers
 * Back to top, font size controls, optional reading progress.
 */
(function () {
  "use strict";
  function injectBackToTop() {
    if (document.getElementById("bs-back-top")) return;
    var btn = document.createElement("button");
    btn.id = "bs-back-top";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.textContent = "↑";
    btn.style.cssText = "position:fixed;bottom:1.25rem;right:1.25rem;z-index:90;width:44px;height:44px;border-radius:50%;border:1px solid #303038;background:#1C1C24;color:#fff;font-size:1.1rem;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .2s;box-shadow:0 4px 16px rgba(0,0,0,.4)";
    document.body.appendChild(btn);
    window.addEventListener("scroll", function () {
      var show = window.scrollY > 400;
      btn.style.opacity = show ? "1" : "0";
      btn.style.pointerEvents = show ? "auto" : "none";
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  function injectA11yBar() {
    if (document.getElementById("bs-a11y-bar")) return;
    var bar = document.createElement("div");
    bar.id = "bs-a11y-bar";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Text size");
    bar.style.cssText = "position:fixed;bottom:1.25rem;left:1.25rem;z-index:90;display:flex;gap:4px;background:#1C1C24;border:1px solid #303038;border-radius:8px;padding:4px;box-shadow:0 4px 16px rgba(0,0,0,.4)";
    function mk(label, size, title) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.title = title;
      b.setAttribute("aria-label", title);
      b.style.cssText = "min-width:36px;height:36px;border:0;background:transparent;color:#ccc;border-radius:6px;cursor:pointer;font-weight:700;font-size:.85rem";
      b.addEventListener("click", function () {
        document.documentElement.style.fontSize = size;
        try { localStorage.setItem("bs_font_scale", size); } catch (e) {}
      });
      return b;
    }
    bar.appendChild(mk("A−", "15px", "Smaller text"));
    bar.appendChild(mk("A", "16px", "Default text size"));
    bar.appendChild(mk("A+", "18px", "Larger text"));
    document.body.appendChild(bar);
    try {
      var saved = localStorage.getItem("bs_font_scale");
      if (saved) document.documentElement.style.fontSize = saved;
    } catch (e) {}
  }
  function readingProgress() {
    if (document.getElementById("bs-progress")) return;
    if (document.body.scrollHeight <= window.innerHeight * 2.2) return;
    var bar = document.createElement("div");
    bar.id = "bs-progress";
    bar.setAttribute("role", "progressbar");
    bar.style.cssText = "position:fixed;top:0;left:0;height:3px;width:0;z-index:100;background:#E50914;transition:width .05s linear;pointer-events:none";
    document.body.appendChild(bar);
    window.addEventListener("scroll", function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      bar.style.width = pct + "%";
    }, { passive: true });
  }
  function init() {
    injectBackToTop();
    injectA11yBar();
    readingProgress();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
