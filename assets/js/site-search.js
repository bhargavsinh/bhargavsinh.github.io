/**
 * V17.4 — Client-side title search (static JSON index)
 * No server. No downloads.
 */
(function () {
  "use strict";

  var INDEX = null;
  var panel = null;
  var input = null;
  var list = null;

  function indexUrl() {
    var path = (location.pathname || "").replace(/\\/g, "/");
    if (path.indexOf("/Book-Publications-Reader/") !== -1 ||
        path.indexOf("/HR-Recruiter/") !== -1 ||
        path.indexOf("/Visitor/") !== -1) {
      return "../assets/js/search-index.json";
    }
    return "assets/js/search-index.json";
  }

  function resolveHref(u) {
    var path = (location.pathname || "").replace(/\\/g, "/");
    var inPortal = path.indexOf("/Book-Publications-Reader/") !== -1 ||
      path.indexOf("/HR-Recruiter/") !== -1 ||
      path.indexOf("/Visitor/") !== -1;
    if (!inPortal) return u.replace(/^\//, "");
    if (u.indexOf("/Book-Publications-Reader/") === 0 ||
        u.indexOf("/HR-Recruiter/") === 0 ||
        u.indexOf("/Visitor/") === 0) {
      return ".." + u;
    }
    if (u === "/index.html" || u === "/") return "../index.html";
    if (u === "/sitemap.html") return "../sitemap.html";
    return ".." + u;
  }

  function ensureUI() {
    if (document.getElementById("bs-search-root")) return;

    var root = document.createElement("div");
    root.id = "bs-search-root";
    root.innerHTML =
      '<button type="button" class="bs-search-toggle" id="bs-search-toggle" aria-label="Search site" aria-expanded="false" aria-controls="bs-search-panel">⌕</button>' +
      '<div class="bs-search-panel" id="bs-search-panel" role="dialog" aria-label="Site search" hidden>' +
      '  <div class="bs-search-box">' +
      '    <label class="bs-search-label" for="bs-search-input">Search pages</label>' +
      '    <input type="search" id="bs-search-input" class="bs-search-input" placeholder="Search titles…" autocomplete="off" enterkeyhint="search">' +
      '    <button type="button" class="bs-search-close" id="bs-search-close" aria-label="Close search">✕</button>' +
      '  </div>' +
      '  <ul class="bs-search-results" id="bs-search-results" role="listbox" aria-label="Results"></ul>' +
      '  <p class="bs-search-hint">Client-side search · titles only</p>' +
      '</div>';
    document.body.appendChild(root);

    panel = document.getElementById("bs-search-panel");
    input = document.getElementById("bs-search-input");
    list = document.getElementById("bs-search-results");

    document.getElementById("bs-search-toggle").addEventListener("click", open);
    document.getElementById("bs-search-close").addEventListener("click", close);
    input.addEventListener("input", onQuery);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
      if (e.key === "Escape" && panel && !panel.hidden) close();
    });
  }

  function open() {
    ensureUI();
    panel.hidden = false;
    document.getElementById("bs-search-toggle").setAttribute("aria-expanded", "true");
    loadIndex().then(function () {
      input.focus();
      onQuery();
    });
  }

  function close() {
    if (!panel) return;
    panel.hidden = true;
    document.getElementById("bs-search-toggle").setAttribute("aria-expanded", "false");
  }

  function loadIndex() {
    if (INDEX) return Promise.resolve(INDEX);
    return fetch(indexUrl(), { credentials: "same-origin" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        INDEX = data;
        return INDEX;
      })
      .catch(function () {
        INDEX = [];
        return INDEX;
      });
  }

  function onQuery() {
    if (!INDEX || !list) return;
    var q = (input.value || "").trim().toLowerCase();
    list.innerHTML = "";
    if (!q) {
      list.innerHTML = '<li class="bs-search-empty">Type to search…</li>';
      return;
    }
    var hits = INDEX.filter(function (item) {
      var hay = (item.t + " " + (item.k || "") + " " + (item.p || "")).toLowerCase();
      return hay.indexOf(q) !== -1;
    }).slice(0, 12);

    if (!hits.length) {
      list.innerHTML = '<li class="bs-search-empty">No matching pages</li>';
      return;
    }
    hits.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = resolveHref(item.u);
      a.setAttribute("role", "option");
      a.innerHTML = "<span class=\"bs-search-portal\">" + escapeHtml(item.p) + "</span> " +
        "<span class=\"bs-search-title\">" + escapeHtml(item.t) + "</span>";
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """);
  }

  function init() {
    ensureUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
