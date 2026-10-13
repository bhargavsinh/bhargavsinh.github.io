/**
 * BHARGAVSINH SISODIYA — V16.1
 * Shared cinematic navigation + footer injector for all pages
 */
(function () {
  "use strict";

  const NAV_HTML = `
  <header class="site-nav scrolled" id="site-nav" role="banner">
    <div class="nav-inner">
      <a href="index.html" class="brand" aria-label="BHARGAVSINH SISODIYA — Home">
        BHARGAV<span>SINH</span>
      </a>
      <nav class="nav-links" aria-label="Primary">
        <a href="index.html">Home</a>
        <a href="projects.html">Projects</a>
        <a href="otherlinks.html">Books &amp; Publications</a>
        <a href="blog.html">Blogs</a>
        <a href="vanshavali.html">Heritage &amp; Research</a>
        <a href="ghostwriting.html">Services</a>
        <a href="contact.html">Contact</a>
      </nav>
      <div class="nav-actions">
        <a href="index.html" class="nav-btn" aria-label="Search on home" title="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </a>
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
      <p>© ${new Date().getFullYear()} BHARGAVSINH SISODIYA. All rights reserved. · V16.1 Cinematic Edition</p>
    </div>
  </footer>`;

  function injectShell() {
    // Inject nav at start of body
    const navMount = document.getElementById("cinematic-nav");
    if (navMount) {
      navMount.outerHTML = NAV_HTML;
    } else {
      document.body.insertAdjacentHTML("afterbegin", NAV_HTML);
    }

    // Inject footer at end
    const footerMount = document.getElementById("cinematic-footer");
    if (footerMount) {
      footerMount.outerHTML = FOOTER_HTML;
    } else {
      document.body.insertAdjacentHTML("beforeend", FOOTER_HTML);
    }

    // Highlight active nav link
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-links a, .mobile-nav-links a").forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });

    // Mobile menu
    const toggle = document.getElementById("menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    const closeBtn = document.getElementById("mobile-nav-close");
    if (toggle && mobileNav) {
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
      if (closeBtn) closeBtn.addEventListener("click", close);
      mobileNav.addEventListener("click", e => { if (e.target === mobileNav) close(); });
      mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
    }

    // Escape closes mobile nav
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && mobileNav?.classList.contains("open")) {
        mobileNav.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectShell);
  } else {
    injectShell();
  }
})();
