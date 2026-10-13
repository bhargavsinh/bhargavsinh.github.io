/**
 * BHARGAVSINH SISODIYA — V16.0 CINEMATIC EDITION
 * Rails, search, modal, continue-exploring, navigation
 */
(function () {
  "use strict";

  const STORAGE_KEY = "bs_continue_v16";
  const MAX_CONTINUE = 8;

  // ---------- Helpers ----------
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function getContinueIds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function pushContinue(id) {
    if (!id) return;
    let ids = getContinueIds().filter(x => x !== id);
    ids.unshift(id);
    ids = ids.slice(0, MAX_CONTINUE);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch {}
  }

  function clearContinue() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  function getItemsByRail(key) {
    const data = window.PORTFOLIO_CONTENT;
    if (!data) return [];
    if (key === "all") return data.items;
    if (key === "continue") {
      const ids = getContinueIds();
      return ids.map(id => data.items.find(i => i.id === id)).filter(Boolean);
    }
    return data.items.filter(i => (i.rail || []).includes(key));
  }

  function categoryIcon(cat) {
    const map = {
      Project: "💻", Book: "📘", Research: "📜", Article: "✍️",
      Heritage: "🏛️", Service: "🛠️", Profile: "👤", Legal: "⚖️",
      Library: "📚", Blog: "📰", Policy: "📋", "Heritage Project": "🏰"
    };
    return map[cat] || "◆";
  }

  // ---------- Card rendering ----------
  function createCard(item) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.dataset.id = item.id;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${item.title} — ${item.category}`);

    const thumb = document.createElement("div");
    thumb.className = "card-thumb";
    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title;
      img.loading = "lazy";
      thumb.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "card-thumb-placeholder";
      ph.textContent = categoryIcon(item.category);
      ph.setAttribute("aria-hidden", "true");
      thumb.appendChild(ph);
    }
    if (item.status) {
      const badge = document.createElement("span");
      badge.className = "card-badge";
      badge.textContent = item.status;
      thumb.appendChild(badge);
    }

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `
      <div class="card-category">${item.category}</div>
      <h3 class="card-title">${item.title}</h3>
      <p class="card-desc">${item.description || ""}</p>
      <div class="card-actions">
        <a class="card-action-btn primary" href="${item.href}" data-open="${item.id}">Open</a>
        <button type="button" class="card-action-btn" data-detail="${item.id}">Details</button>
      </div>
    `;

    card.appendChild(thumb);
    card.appendChild(body);

    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-detail]")) {
        e.preventDefault();
        openModal(item);
        return;
      }
      if (e.target.closest("a")) {
        pushContinue(item.id);
        return;
      }
      // whole card click → open page
      pushContinue(item.id);
      window.location.href = item.href;
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pushContinue(item.id);
        window.location.href = item.href;
      }
    });

    return card;
  }

  // ---------- Rails ----------
  function renderRails() {
    const container = $("#rails-root");
    if (!container || !window.PORTFOLIO_CONTENT) return;

    const rails = window.PORTFOLIO_CONTENT.rails;
    container.innerHTML = "";

    rails.forEach(railDef => {
      const items = getItemsByRail(railDef.key);
      if (railDef.key === "continue" && items.length === 0) return;

      const section = document.createElement("section");
      section.className = "rail";
      section.id = `rail-${railDef.id}`;
      section.setAttribute("aria-labelledby", `rail-title-${railDef.id}`);

      const header = document.createElement("div");
      header.className = "rail-header";
      header.innerHTML = `
        <h2 class="rail-title" id="rail-title-${railDef.id}">${railDef.title}</h2>
        <div class="rail-controls">
          <button type="button" class="rail-btn" data-dir="prev" aria-label="Scroll left">‹</button>
          <button type="button" class="rail-btn" data-dir="next" aria-label="Scroll right">›</button>
        </div>
      `;
      if (railDef.key === "continue") {
        const clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.className = "rail-btn";
        clearBtn.style.marginLeft = "0.4rem";
        clearBtn.textContent = "✕";
        clearBtn.setAttribute("aria-label", "Clear continue history");
        clearBtn.title = "Clear history";
        clearBtn.addEventListener("click", () => {
          clearContinue();
          renderRails();
        });
        header.querySelector(".rail-controls").appendChild(clearBtn);
      }

      const trackWrap = document.createElement("div");
      trackWrap.className = "rail-track-wrapper";
      const track = document.createElement("div");
      track.className = "rail-track";
      track.setAttribute("role", "list");

      items.forEach(item => {
        const card = createCard(item);
        card.setAttribute("role", "listitem");
        track.appendChild(card);
      });

      trackWrap.appendChild(track);
      section.appendChild(header);
      section.appendChild(trackWrap);
      container.appendChild(section);

      // scroll controls
      const prev = header.querySelector('[data-dir="prev"]');
      const next = header.querySelector('[data-dir="next"]');
      const scrollAmount = () => Math.min(track.clientWidth * 0.8, 600);

      prev.addEventListener("click", () => {
        track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
      });
      next.addEventListener("click", () => {
        track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
      });

      const updateBtns = () => {
        prev.disabled = track.scrollLeft <= 4;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      };
      track.addEventListener("scroll", updateBtns, { passive: true });
      updateBtns();
    });
  }

  // ---------- Modal ----------
  let lastFocus = null;

  function openModal(item) {
    lastFocus = document.activeElement;
    const overlay = $("#modal-overlay");
    const modal = $("#modal");
    if (!overlay || !modal) return;

    $("#modal-category").textContent = item.category;
    $("#modal-title").textContent = item.title;
    $("#modal-desc").textContent = item.description || "";
    const openBtn = $("#modal-open");
    openBtn.href = item.href;
    openBtn.onclick = () => pushContinue(item.id);

    const thumb = $("#modal-thumb");
    thumb.innerHTML = "";
    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title;
      thumb.appendChild(img);
    } else {
      thumb.textContent = categoryIcon(item.category);
    }

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#modal-close").focus();
  }

  function closeModal() {
    const overlay = $("#modal-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  // ---------- Search ----------
  function openSearch() {
    const overlay = $("#search-overlay");
    if (!overlay) return;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const input = $("#search-input");
    input.value = "";
    input.focus();
    renderSearchResults("");
  }

  function closeSearch() {
    const overlay = $("#search-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function renderSearchResults(query) {
    const container = $("#search-results");
    if (!container || !window.PORTFOLIO_CONTENT) return;

    const q = (query || "").trim().toLowerCase();
    const items = window.PORTFOLIO_CONTENT.items;

    let results = items;
    if (q) {
      results = items.filter(item => {
        const hay = [
          item.title, item.description, item.category,
          ...(item.tags || []), item.language || "", item.author || ""
        ].join(" ").toLowerCase();
        return hay.includes(q);
      });
    }

    if (results.length === 0) {
      container.innerHTML = `<div class="search-empty">No results found for “${query}”. Try a different term.</div>`;
      return;
    }

    container.innerHTML = results.slice(0, 30).map(item => `
      <a class="search-result" href="${item.href}" data-id="${item.id}">
        <div>
          <div class="search-result-cat">${item.category}</div>
          <div class="search-result-title">${item.title}</div>
          <div class="search-result-desc">${item.description || ""}</div>
        </div>
      </a>
    `).join("");

    $$(".search-result", container).forEach(el => {
      el.addEventListener("click", () => pushContinue(el.dataset.id));
    });
  }

  // ---------- Navigation scroll state ----------
  function initNav() {
    const nav = $("#site-nav");
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- Mobile menu ----------
  function initMobileMenu() {
    const toggle = $("#menu-toggle");
    const mobileNav = $("#mobile-nav");
    const closeBtn = $("#mobile-nav-close");
    if (!toggle || !mobileNav) return;

    const open = () => {
      mobileNav.classList.add("open");
      mobileNav.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };
    const close = () => {
      mobileNav.classList.remove("open");
      mobileNav.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      toggle.focus();
    };

    toggle.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    mobileNav.addEventListener("click", (e) => {
      if (e.target === mobileNav) close();
    });
    $$(".mobile-nav-links a").forEach(a => a.addEventListener("click", close));
  }

  // ---------- Keyboard global ----------
  function initKeyboard() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if ($("#search-overlay")?.classList.contains("open")) closeSearch();
        else if ($("#modal-overlay")?.classList.contains("open")) closeModal();
        else if ($("#mobile-nav")?.classList.contains("open")) {
          $("#mobile-nav").classList.remove("open");
          document.body.style.overflow = "";
        }
      }
      // / to open search when not typing
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        openSearch();
      }
    });
  }

  // ---------- Spotlight ----------
  function renderSpotlight() {
    const data = window.PORTFOLIO_CONTENT;
    if (!data) return;
    // Prefer satyanisodh or first featured
    const item = data.items.find(i => i.id === "satyanisodh") ||
                 data.items.find(i => (i.rail || []).includes("featured"));
    if (!item) return;

    const el = $("#spotlight");
    if (!el) return;
    $("#spotlight-label").textContent = item.category;
    $("#spotlight-title").textContent = item.title;
    $("#spotlight-desc").textContent = item.description;
    const btn = $("#spotlight-btn");
    btn.href = item.href;
    btn.onclick = () => pushContinue(item.id);
  }

  // ---------- Init ----------
  function init() {
    if (!window.PORTFOLIO_CONTENT) {
      console.warn("PORTFOLIO_CONTENT not loaded");
      return;
    }
    initNav();
    initMobileMenu();
    initKeyboard();
    renderRails();
    renderSpotlight();

    // Search triggers
    $$("[data-open-search]").forEach(btn => btn.addEventListener("click", openSearch));
    $("#search-close")?.addEventListener("click", closeSearch);
    $("#search-overlay")?.addEventListener("click", (e) => {
      if (e.target.id === "search-overlay") closeSearch();
    });
    $("#search-input")?.addEventListener("input", (e) => renderSearchResults(e.target.value));
    $("#search-clear")?.addEventListener("click", () => {
      const input = $("#search-input");
      input.value = "";
      input.focus();
      renderSearchResults("");
    });

    // Modal
    $("#modal-close")?.addEventListener("click", closeModal);
    $("#modal-overlay")?.addEventListener("click", (e) => {
      if (e.target.id === "modal-overlay") closeModal();
    });

    // Service worker (keep existing if present)
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
