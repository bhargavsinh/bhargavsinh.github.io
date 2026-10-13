/**
 * V16.1 — Shared page shell (nav + footer + search + mobile menu)
 * Used by all content pages so they share the cinematic chrome.
 */
(function () {
  "use strict";

  const NAV_HTML = `
  <header class="site-nav" id="site-nav" role="banner">
    <div class="nav-inner">
      <a href="index.html" class="brand" aria-label="BHARGAVSINH SISODIYA — Home">BHARGAV<span>SINH</span></a>
      <nav class="nav-links" aria-label="Primary">
        <a href="index.html" data-nav="home">Home</a>
        <a href="projects.html" data-nav="projects">Projects</a>
        <a href="otherlinks.html" data-nav="books">Books &amp; Publications</a>
        <a href="blog.html" data-nav="blogs">Blogs</a>
        <a href="vanshavali.html" data-nav="heritage">Heritage &amp; Research</a>
        <a href="ghostwriting.html" data-nav="services">Services</a>
        <a href="contact.html" data-nav="contact">Contact</a>
      </nav>
      <div class="nav-actions">
        <button type="button" class="nav-btn" data-open-search aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <button type="button" class="menu-toggle" id="menu-toggle" aria-label="Open menu">☰</button>
      </div>
    </div>
  </header>
  <div class="mobile-nav" id="mobile-nav" aria-hidden="true" role="dialog" aria-label="Mobile menu">
    <div class="mobile-nav-panel">
      <div class="mobile-nav-close">
        <button type="button" class="nav-btn" id="mobile-nav-close" aria-label="Close menu">✕</button>
      </div>
      <nav class="mobile-nav-links" aria-label="Mobile">
        <a href="index.html">Home</a>
        <a href="projects.html">Projects</a>
        <a href="otherlinks.html">Books &amp; Publications</a>
        <a href="blog.html">Blogs</a>
        <a href="vanshavali.html">Heritage &amp; Research</a>
        <a href="pushtimarg.html">Pushtimarg</a>
        <a href="ghostwriting.html">Services</a>
        <a href="resume.html">Resume</a>
        <a href="contact.html">Contact</a>
        <a href="about.html">About</a>
      </nav>
    </div>
  </div>`;

  const FOOTER_HTML = `
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div>
        <div class="footer-brand">BHARGAV<span>SINH</span></div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.5rem;max-width:240px;">
          Personal portfolio, digital library, research archive &amp; creative services.
        </p>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <a href="projects.html">Projects</a>
        <a href="otherlinks.html">Publications</a>
        <a href="blog.html">Blogs</a>
        <a href="vanshavali.html">Genealogy</a>
      </div>
      <div class="footer-col">
        <h4>Research</h4>
        <a href="pushtimarg.html">Pushtimarg</a>
        <a href="pushtimarg-ma-gruh-seva.html">ગૃહ સેવા</a>
        <a href="Mewad_history_blog.html">Mewad History</a>
        <a href="satyanisodh.html">સત્યની શોધ</a>
      </div>
      <div class="footer-col">
        <h4>Connect</h4>
        <a href="contact.html">Contact</a>
        <a href="resume.html">Resume</a>
        <a href="ghostwriting.html">Services</a>
        <a href="about.html">About</a>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <a href="privacy-policy.html">Privacy</a>
        <a href="termsofuse.html">Terms</a>
        <a href="disclaimer.html">Disclaimer</a>
        <a href="grievance.html">Grievance</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© <span id="year"></span> BHARGAVSINH SISODIYA. All rights reserved. · V16.1 Cinematic Edition</p>
    </div>
  </footer>`;

  const SEARCH_HTML = `
  <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true">
    <div class="search-box">
      <div class="search-input-row">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="search" id="search-input" placeholder="Search projects, books, articles…" autocomplete="off" aria-label="Search query">
        <button type="button" class="search-clear" id="search-clear">Clear</button>
        <button type="button" class="nav-btn" id="search-close" aria-label="Close search">✕</button>
      </div>
      <div class="search-results" id="search-results" role="listbox"></div>
    </div>
    <p class="search-close-hint">Press <kbd>Esc</kbd> to close</p>
  </div>`;

  function injectShell() {
    // Remove old header/footer containers if present
    const oldHeader = document.getElementById("header-container");
    const oldFooter = document.getElementById("footer-container");
    if (oldHeader) oldHeader.remove();
    if (oldFooter) oldFooter.remove();

    // Inject nav at top of body
    document.body.insertAdjacentHTML("afterbegin", NAV_HTML);
    // Inject footer + search at end of body
    document.body.insertAdjacentHTML("beforeend", FOOTER_HTML + SEARCH_HTML);

    // Year
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    // Highlight active nav link
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-links a, .mobile-nav-links a").forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });
  }

  function initNavScroll() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 20) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const closeBtn = document.getElementById("mobile-nav-close");
    if (!toggle || !mobileNav) return;
    const open = () => {
      mobileNav.classList.add("open");
      mobileNav.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      mobileNav.classList.remove("open");
      mobileNav.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    toggle.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    mobileNav.addEventListener("click", e => { if (e.target === mobileNav) close(); });
    document.querySelectorAll(".mobile-nav-links a").forEach(a => a.addEventListener("click", close));
  }

  function openSearch() {
    const overlay = document.getElementById("search-overlay");
    if (!overlay) return;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const input = document.getElementById("search-input");
    input.value = "";
    input.focus();
    renderSearch("");
  }

  function closeSearch() {
    const overlay = document.getElementById("search-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function renderSearch(query) {
    const container = document.getElementById("search-results");
    if (!container) return;
    if (!window.PORTFOLIO_CONTENT) {
      container.innerHTML = '<div class="search-empty">Search index loading…</div>';
      return;
    }
    const q = (query || "").trim().toLowerCase();
    let results = window.PORTFOLIO_CONTENT.items;
    if (q) {
      results = results.filter(item => {
        const hay = [item.title, item.description, item.category, ...(item.tags || [])].join(" ").toLowerCase();
        return hay.includes(q);
      });
    }
    if (!results.length) {
      container.innerHTML = `<div class="search-empty">No results for “${query}”.</div>`;
      return;
    }
    container.innerHTML = results.slice(0, 25).map(item => `
      <a class="search-result" href="${item.href}">
        <div>
          <div class="search-result-cat">${item.category}</div>
          <div class="search-result-title">${item.title}</div>
          <div class="search-result-desc">${item.description || ""}</div>
        </div>
      </a>`).join("");
  }

  function initSearch() {
    document.querySelectorAll("[data-open-search]").forEach(b => b.addEventListener("click", openSearch));
    document.getElementById("search-close")?.addEventListener("click", closeSearch);
    document.getElementById("search-overlay")?.addEventListener("click", e => {
      if (e.target.id === "search-overlay") closeSearch();
    });
    document.getElementById("search-input")?.addEventListener("input", e => renderSearch(e.target.value));
    document.getElementById("search-clear")?.addEventListener("click", () => {
      const input = document.getElementById("search-input");
      input.value = "";
      input.focus();
      renderSearch("");
    });
  }

  function initKeyboard() {
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        if (document.getElementById("search-overlay")?.classList.contains("open")) closeSearch();
        else if (document.getElementById("mobile-nav")?.classList.contains("open")) {
          document.getElementById("mobile-nav").classList.remove("open");
          document.body.style.overflow = "";
        }
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        openSearch();
      }
    });
  }



  function injectThemeOverrides() {
    // External overrides sheet (wins over Tailwind when appended last)
    if (!document.querySelector('link[href*="theme-overrides"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "assets/css/theme-overrides.css?v=16.1b";
      document.head.appendChild(link);
    }
    const CSS = "h1,h1.font-yatra,.font-yatra.text-divine-gold,.text-divine-gold,h1[class*=text-amber],h1[class*=text-divine]{color:#fff!important}.text-amber-300,.text-amber-400,.text-divine-gold,[class*=text-amber-3],[class*=text-amber-4],[class*=text-divine]{color:#E50914!important}h1.text-amber-400,h1.text-divine-gold{color:#fff!important}";
    function apply() {
      let s = document.getElementById("v16-theme-overrides");
      if (!s) { s = document.createElement("style"); s.id = "v16-theme-overrides"; }
      s.textContent = CSS;
      document.head.appendChild(s);
    }
    apply();
    setTimeout(apply, 200);
    setTimeout(apply, 800);
    setTimeout(apply, 2000);
  }

  function init() {
    injectThemeOverrides();
    injectShell();
    initNavScroll();
    initMobileMenu();
    initSearch();
    initKeyboard();
    // Register SW if available
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
