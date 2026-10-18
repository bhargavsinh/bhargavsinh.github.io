/**
 * V17.2 — Client-side hardening helpers (static site)
 *
 * LIMITATIONS (read carefully):
 * - Meta CSP is defence-in-depth only; frame-ancestors is NOT enforced via <meta>.
 * - True clickjacking protection needs HTTP response headers (not available on plain GitHub Pages).
 * - Frame-guard, honeypot, and sessionStorage rate-limits are UX friction — not server security.
 * - Content protection (copy/right-click) is client-side deterrence only.
 * - Do not market this layer as "ultra-high security".
 */

(function () {
  "use strict";

  // ---- 1. Harden all external links ----
  function hardenLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(function (a) {
      try {
        var u = new URL(a.href, location.href);
        if (u.origin !== location.origin) {
          a.setAttribute("rel", "noopener noreferrer nofollow");
          if (!a.target) a.setAttribute("target", "_blank");
        }
      } catch (e) { /* ignore invalid */ }
    });
  }

  // ---- 2. Contact / form hardening ----
  function hardenForms() {
    document.querySelectorAll("form").forEach(function (form) {
      form.setAttribute("autocomplete", form.getAttribute("autocomplete") || "on");
      form.querySelectorAll("input, textarea").forEach(function (el) {
        el.addEventListener("input", function () {
          if (el.value) {
            el.value = el.value.replace(/\0/g, "");
          }
        });
      });

      form.addEventListener("submit", function (e) {
        var hp = form.querySelector('[name="website_url"], [name="company_fax"], .js-honeypot');
        if (hp && hp.value) {
          e.preventDefault();
          return false;
        }

        var key = "bs_form_ts";
        try {
          var last = parseInt(sessionStorage.getItem(key) || "0", 10);
          var now = Date.now();
          if (now - last < 8000) {
            e.preventDefault();
            alert("Please wait a few seconds before submitting again.");
            return false;
          }
          sessionStorage.setItem(key, String(now));
        } catch (err) { /* storage blocked */ }

        form.querySelectorAll("input[type=text], input[type=email], textarea").forEach(function (el) {
          var max = el.getAttribute("maxlength") || (el.tagName === "TEXTAREA" ? 5000 : 300);
          if (el.value && el.value.length > max) {
            el.value = el.value.slice(0, max);
          }
        });
      });
    });
  }

  // ---- 3. Add honeypot to contact forms if missing ----
  function ensureHoneypot() {
    document.querySelectorAll("form").forEach(function (form) {
      if (form.querySelector(".js-honeypot")) return;
      var wrap = document.createElement("div");
      wrap.className = "js-honeypot";
      wrap.setAttribute("aria-hidden", "true");
      wrap.style.cssText = "position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden;";
      wrap.innerHTML = '<label>Leave blank<input type="text" name="website_url" tabindex="-1" autocomplete="off"></label>';
      form.appendChild(wrap);
    });
  }

  // ---- 4. Prevent framing (extra client guard) ----
  function frameGuard() {
    try {
      if (window.top !== window.self) {
        window.top.location = window.self.location;
      }
    } catch (e) {
      document.body.style.display = "none";
    }
  }

  // ---- 5. Security meta tags (if not already present) ----
  function ensureSecurityMeta() {
    var metas = [
      { httpEquiv: "X-Content-Type-Options", content: "nosniff" },
      { name: "referrer", content: "strict-origin-when-cross-origin" },
      { httpEquiv: "X-UA-Compatible", content: "IE=edge" },
      {
        httpEquiv: "Content-Security-Policy",
        content: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "img-src 'self' data: https: blob:",
          "connect-src 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self' https:",
          "upgrade-insecure-requests"
        ].join("; ")
      }
    ];

    metas.forEach(function (m) {
      var sel = m.httpEquiv
        ? 'meta[http-equiv="' + m.httpEquiv + '"]'
        : 'meta[name="' + m.name + '"]';
      if (document.querySelector(sel)) return;
      var el = document.createElement("meta");
      if (m.httpEquiv) el.setAttribute("http-equiv", m.httpEquiv);
      if (m.name) el.setAttribute("name", m.name);
      el.setAttribute("content", m.content);
      document.head.appendChild(el);
    });
  }

  // ---- 6. Mark active nav link ----
  function markActiveNav() {
    var file = (location.pathname.split("/").pop() || "").toLowerCase();
    document.querySelectorAll(".portal-nav a, .portal-drawer-links a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
      if (href && href === file) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  // ---- 7. Mobile drawer ----
  function initDrawer() {
    var toggle = document.getElementById("portal-menu-toggle");
    var drawer = document.getElementById("portal-mobile-nav");
    var closeBtn = document.getElementById("portal-drawer-close");
    if (!toggle || !drawer) return;

    function open() {
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      closeBtn && closeBtn.focus();
    }
    function close() {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      toggle.focus();
    }

    toggle.addEventListener("click", open);
    closeBtn && closeBtn.addEventListener("click", close);
    drawer.addEventListener("click", function (e) {
      if (e.target === drawer) close();
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) close();
    });
  }

  // ---- 8. Year stamps ----
  function fillYears() {
    document.querySelectorAll(".js-year").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  // ---- 9. Content misuse deterrence (copy / right-click)
  // NOTE: Client-side only. Does not prevent screenshots, DevTools, or determined scraping.
  // Accessibility: keyboard navigation and screen readers remain unaffected.
  function contentProtection() {
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      return false;
    }, { capture: true });

    document.addEventListener("copy", function (e) {
      e.preventDefault();
      return false;
    }, { capture: true });

    document.addEventListener("cut", function (e) {
      e.preventDefault();
      return false;
    }, { capture: true });

    document.addEventListener("selectstart", function (e) {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }
      e.preventDefault();
      return false;
    }, { capture: true });
  }

  // ---- Init ----
  function init() {
    frameGuard();
    ensureSecurityMeta();
    hardenLinks();
    ensureHoneypot();
    hardenForms();
    markActiveNav();
    initDrawer();
    fillYears();
    contentProtection();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
