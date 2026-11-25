/* Zoom-in animation for every photo on the page.
   Each photo eases from a slight zoom to its natural size as it scrolls into
   view. Only photos that sit inside a clipping container are animated (so the
   zoom can never spill outside its frame); logos and icons are skipped.
   Uses the CSS `scale` property so it does not clash with other transforms.
   Skipped entirely for visitors who prefer reduced motion. */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var css = document.createElement('style');
  css.textContent =
    'img[data-zoom]{scale:1.16;transition:scale 1.5s cubic-bezier(.2,.7,.2,1);will-change:scale}' +
    'img[data-zoom].is-zoomed{scale:1}';
  document.head.appendChild(css);

  var SKIP = 'header,footer,.ahead,.hdr,.lp-top,.ft,.lp-ft,.nl,#bfpop,.vsl-modal,.logo,.lp-top-logo';
  function clipped(img) {
    var el = img.parentElement;
    for (var i = 0; i < 3 && el; i++, el = el.parentElement) {
      var o = getComputedStyle(el).overflow;
      if (o === 'hidden' || o === 'clip' || o === 'auto') return true;
    }
    return false;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-zoomed');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  function scan() {
    document.querySelectorAll('img:not([data-zoom])').forEach(function (img) {
      if (img.closest(SKIP) || !clipped(img)) return;
      var r = img.getBoundingClientRect();
      if (r.width && r.width < 56) return; // icons / thumbnails-in-lists too small to notice
      img.setAttribute('data-zoom', '');
      io.observe(img);
    });
  }

  var t;
  function later() { clearTimeout(t); t = setTimeout(scan, 120); }
  if (document.readyState === 'complete') scan();
  else window.addEventListener('load', scan);
  // photos created later (the video slider builds its tiles with JS)
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
})();
