/* Level-4 content security — deterrence only (not cryptographic DRM). V18.1.3 + retro bridge */
(function () {
  "use strict";
  try {
    var doc = document;
    if (!doc.body) return;
    doc.body.classList.add("is-protected", "l4-secure");
    if (!doc.body.hasAttribute("data-protect")) doc.body.setAttribute("data-protect", "");

    function editable(t) {
      if (!t) return false;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return true;
      if (t.isContentEditable) return true;
      if (t.closest && t.closest("[data-allow-copy], .allow-copy, #search, .search, #search-input")) return true;
      return false;
    }
    function isImg(t) {
      return t && (t.tagName === "IMG" || (t.closest && t.closest("img, picture, .portal-img, .book-cover, .card-cover, .hero-media")));
    }

    var imgs = doc.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].classList.add("protected");
      imgs[i].setAttribute("draggable", "false");
    }

    function block(e) {
      if (editable(e.target)) return;
      if (e.type === "contextmenu" && e.target && e.target.closest && e.target.closest("a, button, [data-search], .ib, .btn")) return;
      e.preventDefault();
      return false;
    }

    ["copy", "cut", "paste", "contextmenu", "selectstart", "dragstart"].forEach(function (ev) {
      doc.addEventListener(ev, function (e) {
        if (ev === "dragstart" && (isImg(e.target) || !editable(e.target))) {
          e.preventDefault();
          return false;
        }
        if (ev !== "dragstart") return block(e);
      }, true);
    });

    doc.addEventListener("keydown", function (e) {
      if (editable(e.target)) return;
      var k = (e.key || "").toLowerCase();
      var mod = e.ctrlKey || e.metaKey;
      if (mod && (k === "c" || k === "x" || k === "a" || k === "s" || k === "u" || k === "p")) {
        e.preventDefault();
        return false;
      }
    }, true);

    doc.addEventListener("mouseup", function (e) {
      if (editable(e.target)) return;
      try {
        var sel = window.getSelection && window.getSelection();
        if (sel && sel.toString() && sel.toString().length > 0) {
          var an = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode);
          if (!editable(an)) sel.removeAllRanges();
        }
      } catch (e2) {}
    }, true);

    // Load Early-2000s shell on every protected page
    try {
      if (!window.__RETRO_APPLY__) {
        var dr = document.documentElement.getAttribute("data-root");
        var root = (dr === "" || dr === ".") ? "" : (dr ? (dr.endsWith("/") ? dr : dr + "/") : "");
        if (!root) {
          var path = location.pathname || "/";
          var segs = path.split("/").filter(Boolean);
          if (segs.length && segs[segs.length - 1].indexOf(".") !== -1) segs.pop();
          root = segs.map(function () { return "../"; }).join("");
        }
        var s = document.createElement("script");
        s.src = root + "assets/js/retro-apply.js?v=20.3.0";
        s.async = false;
        (document.body || document.documentElement).appendChild(s);
      }
    } catch (eRetro) {}
  } catch (err) {
    if (window.console) console.error(err);
  }
})();
