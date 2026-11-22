// Shared visual-polish layer: scroll reveals, smart sticky nav, animated
// stat counters. Works by progressively enhancing existing markup — no
// per-page HTML changes needed beyond including this script.
document.addEventListener("DOMContentLoaded", function () {
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Smart sticky nav ----------
  (function smartNav() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var lastY = window.scrollY;
    var ticking = false;

    function onScroll() {
      var y = window.scrollY;
      if (y > lastY && y > 120) {
        header.classList.add("nav-hidden");
      } else {
        header.classList.remove("nav-hidden");
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    });
  })();

  // ---------- Scroll reveal ----------
  (function scrollReveal() {
    if (reduceMotion) return;
    var selectors = ".card, .tl-item, .archive-item, .chip, .person, .stat";
    var siblingCounts = new WeakMap(); // group elements by their parent so siblings stagger together

    document.querySelectorAll(selectors).forEach(function (el) {
      if (el.closest(".nav-links, .site-header")) return; // never hide nav content
      el.classList.add("reveal");
      var parent = el.parentElement;
      var index = parent ? siblingCounts.get(parent) || 0 : 0;
      if (parent) siblingCounts.set(parent, index + 1);
      el.style.transitionDelay = Math.min(index * 0.07, 0.42) + "s";
    });

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el) { observer.observe(el); });
  })();

  // ---------- Animated stat counters ----------
  (function statCounters() {
    var stats = document.querySelectorAll(".stat .num");
    if (!stats.length) return;

    function animate(el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^(\d+)(.*)$/);
      if (!match) return; // not a plain number (e.g. already text), leave as-is
      var target = parseInt(match[1], 10);
      var suffix = match[2] || "";

      if (reduceMotion) {
        el.textContent = target + suffix;
        return;
      }

      var start = null;
      var duration = 900;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      stats.forEach(animate);
      return;
    }

    var seen = new WeakSet();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !seen.has(entry.target)) {
            seen.add(entry.target);
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    stats.forEach(function (el) { observer.observe(el); });
  })();
});
