(function () {
  'use strict';

  /* Videos live in the MOVES Google Drive folder "02_Videos" (shared: anyone
     with the link). Posters are small stills in /video-slider/posters. */
  var DRIVE = 'https://drive.google.com/file/d/';
  var VIDEOS = [
    { id: '1BuYxjdrcBfwAYxDeIRgJS7uoFW31eiSU', name: 'Carla', slug: 'carla-testimonial', tag: 'Testimonial' },
    { id: '1loIP2t7vziPUnALhZJqdcx6-XBlfA9yZ', name: 'Jade', slug: 'jade-testimonial', tag: 'Testimonial' },
    { id: '1waSoq5M21wQLJc-R1CuzpdKeAHasL-ye', name: 'Chuko', slug: 'chuko-testimonial', tag: 'Testimonial' },
    { id: '1jdUAaSyVYZ0Vmq-Z6Q5ajn_BxlvhcB4i', name: 'Darcy', slug: 'darcy-testimonial', tag: 'Testimonial' },
    { id: '1wgEhUM8XIlhc8TRF-Z6469vBYWONzqLC', name: 'Darcy 1', slug: 'darcy-1' },
    { id: '1q98o2PNfnkfPyoQQTKgbGvE-uzt4xLx_', name: 'Darcy 2', slug: 'darcy-2' },
    { id: '1GWad9K5alASm1UD9oBGzuNWpMDlJM7jw', name: 'Jade 1', slug: 'jade-1' },
    { id: '1gUc-0ZEesDHCE540XaUzldwJmPjrwDqT', name: 'Jade clip', slug: 'jade-clip' },
    { id: '1ayQ0FA0qlopdC86HF-K_oGT7-mjo4syf', name: 'Chuko 1', slug: 'chuko-1' },
    { id: '1yUfSh12kojpFnPRTaZZQc6pp2W9brwYE', name: 'Girls', slug: 'girls' },
    { id: '1V-y8HP602xdsDvRe3MzjkbwqMKzLmjJN', name: 'Girls 2', slug: 'girls-2' },
    { id: '1862_8Zy8V1k-vBi5xQ2nfKxUqBhRoeD0', name: 'Launch', slug: 'launch' },
    { id: '1n-_oysqrIc0VkBwsoLcPwiMY37ExzOw5', name: 'Launch 2', slug: 'launch-2' },
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
    modal.innerHTML = '<div class="vsl-frame"><button type="button" class="vsl-x" aria-label="Close video">' + CLOSE + '</button></div>';
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
    f.src = DRIVE + v.id + '/preview';
    f.title = v.name + ' video';
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
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- slider ---------- */
  function mount(root) {
    root.classList.add('vsl');
    root.innerHTML =
      '<button type="button" class="vsl-nav vsl-nav--prev" aria-label="Previous videos">' + CHEV_L + '</button>' +
      '<ul class="vsl-track" role="list" aria-label="Customer videos">' +
      VIDEOS.map(function (v, i) {
        return (
          '<li class="vsl-item"><button type="button" class="vsl-card" data-i="' + i + '" aria-label="Play ' + esc(v.name) + '">' +
          '<img src="/video-slider/posters/' + v.slug + '.jpg" alt="" width="640" height="1138" loading="lazy" decoding="async">' +
          (v.tag ? '<span class="vsl-tag"><i></i>' + esc(v.tag) + '</span>' : '') +
          '<span class="vsl-play" aria-hidden="true">' + PLAY + '</span>' +
          '<span class="vsl-name">' + esc(v.name) + '</span></button></li>'
        );
      }).join('') +
      '</ul>' +
      '<button type="button" class="vsl-nav vsl-nav--next" aria-label="Next videos">' + CHEV_R + '</button>' +
      '<div class="vsl-bar" aria-hidden="true"><i></i></div>';

    var track = root.querySelector('.vsl-track');
    var prev = root.querySelector('.vsl-nav--prev');
    var next = root.querySelector('.vsl-nav--next');
    var thumb = root.querySelector('.vsl-bar i');

    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var pos = track.scrollLeft;
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
