(function () {
  'use strict';

  /* Videos live in the MOVES Google Drive folder "02_Videos" (shared: anyone
     with the link). Posters are small stills in /video-slider/posters. */
  var DRIVE = 'https://drive.google.com/file/d/';
  var VIDEOS = [
    // One clip per person/subject (repeat clips were removed as duplicates).
    // No names or tags are shown on the tiles; `name` is only for analytics.
    { id: '1BuYxjdrcBfwAYxDeIRgJS7uoFW31eiSU', name: 'video-1', slug: 'video-1' },
    { id: '1loIP2t7vziPUnALhZJqdcx6-XBlfA9yZ', name: 'video-2', slug: 'video-2' },
    { id: '1jdUAaSyVYZ0Vmq-Z6Q5ajn_BxlvhcB4i', name: 'video-3', slug: 'video-3' },
    { id: '1V-y8HP602xdsDvRe3MzjkbwqMKzLmjJN', name: 'video-4', slug: 'video-4' },
    { id: '1862_8Zy8V1k-vBi5xQ2nfKxUqBhRoeD0', name: 'video-5', slug: 'video-5' },
  ];

  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';
  var CHEV_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEV_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CLOSE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- lightbox (one per page) ---------- */
  var modal, frame, lastFocus;
  function ensureModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'vsl-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '<div class="vsl-frame"><span class="vsl-spin" aria-hidden="true"></span><button type="button" class="vsl-x" aria-label="Close video">' + CLOSE + '</button></div>';
    document.body.appendChild(modal);
    frame = modal.querySelector('.vsl-frame');
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('.vsl-x')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }
  function openModal(v, opener) {
    ensureModal();
    lastFocus = opener || document.activeElement;
    var old = frame.querySelector('iframe');
    if (old) old.remove();
    var f = document.createElement('iframe');
    // Show the poster + a spinner right away; Drive's player takes a moment.
    frame.style.backgroundImage = 'url(/video-slider/posters/' + v.slug + '.webp)';
    frame.classList.add('is-loading');
    f.addEventListener('load', function () { frame.classList.remove('is-loading'); });
    f.src = DRIVE + v.id + '/preview';
    f.title = 'MOVES video';
    f.allow = 'autoplay; fullscreen; encrypted-media';
    f.setAttribute('allowfullscreen', '');
    frame.appendChild(f);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var x = modal.querySelector('.vsl-x');
    if (x) x.focus({ preventScroll: true });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'video_open', video_name: v.name });
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    var f = frame.querySelector('iframe');
    if (f) f.remove(); // stops playback
    frame.classList.remove('is-loading');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- warm up the connection to Google Drive ----------
     Nothing from Drive is requested until a video is opened, so it costs the
     page nothing. We only open the connections shortly before it is needed
     (slider near the viewport, or a tile is hovered/touched). */
  var warmed = false;
  function warm() {
    if (warmed) return;
    warmed = true;
    ['https://drive.google.com', 'https://ssl.gstatic.com', 'https://www.gstatic.com'].forEach(function (href) {
      var l = document.createElement('link');
      l.rel = 'preconnect';
      l.href = href;
      l.crossOrigin = '';
      document.head.appendChild(l);
    });
  }

  /* ---------- slider ---------- */
  function mount(root) {
    root.classList.add('vsl');
    if ('IntersectionObserver' in window) {
      var wio = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { warm(); wio.disconnect(); }
      }, { rootMargin: '400px 0px' });
      wio.observe(root);
    }
    root.addEventListener('pointerenter', warm, { once: true });
    root.addEventListener('touchstart', warm, { once: true, passive: true });
    root.innerHTML =
      '<ul class="vsl-track" role="list" aria-label="Customer videos">' +
      VIDEOS.map(function (v, i) {
        return (
          '<li class="vsl-item"><button type="button" class="vsl-card" data-i="' + i + '" aria-label="Play video ' + (i + 1) + '">' +
          '<img src="/video-slider/posters/' + v.slug + '.webp" alt="" width="480" height="853" loading="lazy" decoding="async">' +
          '<span class="vsl-play" aria-hidden="true">' + PLAY + '</span></button></li>'
        );
      }).join('') +
      '</ul>' +
      '<div class="vsl-ctrl">' +
      '<button type="button" class="vsl-nav vsl-nav--prev" aria-label="Previous videos">' + CHEV_L + '</button>' +
      '<div class="vsl-bar" aria-hidden="true"><i></i></div>' +
      '<button type="button" class="vsl-nav vsl-nav--next" aria-label="Next videos">' + CHEV_R + '</button>' +
      '</div>';

    var track = root.querySelector('.vsl-track');
    var prev = root.querySelector('.vsl-nav--prev');
    var next = root.querySelector('.vsl-nav--next');
    var thumb = root.querySelector('.vsl-bar i');

    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var pos = track.scrollLeft;
      root.classList.toggle('is-static', max <= 2); // everything fits: hide the controls
      prev.disabled = pos <= 2;
      next.disabled = pos >= max - 2;
      var ratio = track.clientWidth / track.scrollWidth;
      thumb.style.width = Math.max(12, Math.min(100, ratio * 100)) + '%';
      thumb.style.left = (max > 0 ? (pos / max) * (100 - parseFloat(thumb.style.width)) : 0) + '%';
    }
    function step(dir) {
      var item = track.querySelector('.vsl-item');
      var gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      var w = item ? item.getBoundingClientRect().width + gap : track.clientWidth;
      var perPage = Math.max(1, Math.floor((track.clientWidth + gap) / w));
      track.scrollBy({ left: dir * w * perPage, behavior: 'smooth' });
    }
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { step(1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { step(-1); e.preventDefault(); }
    });
    track.addEventListener('click', function (e) {
      var card = e.target.closest('.vsl-card');
      if (card) openModal(VIDEOS[+card.dataset.i], card);
    });
    // Posters are stills; if one fails to load, keep the tile on-brand.
    track.addEventListener('error', function (e) {
      if (e.target.tagName === 'IMG') e.target.style.display = 'none';
    }, true);
    update();
    requestAnimationFrame(update);
  }

  function init() {
    document.querySelectorAll('[data-vslider]').forEach(mount);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
