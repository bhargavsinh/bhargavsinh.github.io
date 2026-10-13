/**
 * V17.0 — B.M.S. cinematic intro (Netflix-inspired sequence)
 * Once per session. Skip / Esc / Enter / Space. ?intro=1 to replay.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "bs_intro_seen_v16_6";
  var intro = document.getElementById("bs-intro");
  if (!intro) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = false;
  try { seen = sessionStorage.getItem(STORAGE_KEY) === "1"; } catch (e) {}
  var force = /[?&]intro=1(?:&|$)/.test(location.search);

  if (seen && !force) {
    intro.remove();
    document.body.classList.remove("bs-intro-active");
    return;
  }

  document.body.classList.add("bs-intro-active");

  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function finish() {
    clearTimers();
    intro.classList.add("is-done");
    document.body.classList.remove("bs-intro-active");
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
    later(function () {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    }, 800);
  }

  var skipBtn = document.getElementById("bs-intro-skip");
  if (skipBtn) skipBtn.addEventListener("click", finish);

  document.addEventListener("keydown", function (e) {
    if (!document.body.classList.contains("bs-intro-active")) return;
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      finish();
    }
  });

  if (reduceMotion) {
    intro.classList.add("phase-logo", "phase-tag");
    later(finish, 1000);
    return;
  }

  // Timeline: black → red bar → B.M.S. slam → tag → hold → fade
  later(function () { intro.classList.add("phase-bar"); }, 180);
  later(function () { intro.classList.add("phase-logo"); }, 780);
  later(function () { intro.classList.add("phase-hold"); }, 1600);
  later(function () { intro.classList.add("phase-tag"); }, 1750);
  later(finish, 3800);
})();
