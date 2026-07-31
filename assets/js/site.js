/* ==========================================================================
   Grant Swift · Engineering Portfolio
   Progressive enhancement only. Everything on the page works without this file.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── reveal on scroll ─────────────────────────────────────────── */
  var targets = document.querySelectorAll('.rv, .mask, .drawline');
  if (!('IntersectionObserver' in window) || reduced) {
    targets.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ── sticky nav ───────────────────────────────────────────────── */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('stuck', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── hero parallax ────────────────────────────────────────────── */
  var bg = document.querySelector('.hero .bg');
  if (bg && !reduced) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          bg.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0) scale(1.06)';
        }
        ticking = false;
      });
    }, { passive: true });
    bg.style.transform = 'scale(1.06)';
  }

  /* ── count-up on stat values ──────────────────────────────────── */
  function animateValue(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var dec = (el.dataset.dec | 0);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var dur = 1250, start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = target * eased;
      el.textContent = prefix + v.toLocaleString('en-US', {
        minimumFractionDigits: dec, maximumFractionDigits: dec
      }) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        var t = parseFloat(el.dataset.count), d = (el.dataset.dec | 0);
        el.textContent = (el.dataset.prefix || '') +
          t.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) +
          (el.dataset.suffix || '');
      });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateValue(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ── section rail ─────────────────────────────────────────────── */
  var rail = document.querySelector('.rail');
  if (rail && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(rail.querySelectorAll('a'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    var visible = new Map();
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible.set(e.target.id, e.intersectionRatio); });
      var bestId = null, best = 0;
      visible.forEach(function (ratio, id) { if (ratio > best) { best = ratio; bestId = id; } });
      links.forEach(function (a) {
        a.classList.toggle('on', bestId !== null && a.getAttribute('href') === '#' + bestId);
      });
    }, { threshold: [0, 0.15, 0.35, 0.6, 0.85] });
    sections.forEach(function (s) { sio.observe(s); });
  }

  /* ── year stamp ───────────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
