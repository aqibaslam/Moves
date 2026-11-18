(function () {
  'use strict';

  var root = document.querySelector('.mp-ads-page');
  if (!root) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll reveal (hero excluded: first paint must be immediate) ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var groups = [
      '.mp-sec .mp-head > *',
      '.mp-fm-shot',
      '.mp-fx',
      '.mp-vgrid > li',
      '.mp-tl-row',
      '.mp-vs-c',
      '.mp-center-cta',
      '.mp-tabs',
      '.mp-p3',
      '.mp-p3-cta',
      '.mp-faq-l',
      '.mp-q',
      '.mp-fin-in > *',
      '.mp-ft-cta',
    ];
    var targets = root.querySelectorAll(groups.join(','));
    targets.forEach(function (el) {
      el.setAttribute('data-reveal', '');
      var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sibs, 4) * 80 + 'ms';
    });
    root.classList.add('mp-reveal-ready');

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('mp-revealed');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- price tabs (mobile/tablet) ---------- */
  var tabs = root.querySelectorAll('.mp-tab');
  var cards = root.querySelectorAll('.mp-p3');
  function setTier(tier) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tier') === tier;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    cards.forEach(function (c) {
      c.classList.toggle('is-active', c.getAttribute('data-tier') === tier);
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      setTier(t.getAttribute('data-tier'));
    });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      setTier(next.getAttribute('data-tier'));
    });
  });

  /* ---------- "Find your Move" quiz ---------- */
  var quiz = root.querySelector('#mp-quiz');
  if (!quiz) return;

  var TIERS = {
    one: {
      name: 'ONE',
      level: 1,
      amt: '£63',
      up: '£1,895',
      copy: 'For the one or two teeth that wandered off after braces. The shortest Move.',
    },
    core: {
      name: 'CORE',
      level: 2,
      amt: '£78',
      up: '£2,350',
      copy: 'For the gap, the crowding or the tooth you’ve noticed in photos for years.',
    },
    complete: {
      name: 'COMPLETE',
      level: 3,
      amt: '£107',
      up: '£3,200',
      copy: 'Been told you’d need braces? Crowding and bite, corrected without them.',
    },
  };
  var MAP = { one: 'one', core: 'core', 'core-line': 'core', complete: 'complete' };
  var CONFIRM = ' Your MOVES expert confirms yours on a free video call.';

  var box = quiz.querySelector('.mp-fr');
  var h = quiz.querySelector('#mp-fr-h');
  var bars = quiz.querySelector('#mp-fr-bars');
  var copy = quiz.querySelector('#mp-fr-copy');
  var amt = quiz.querySelector('#mp-fr-amt');
  var sub = quiz.querySelector('#mp-fr-sub');
  var cta = quiz.querySelector('#mp-fr-cta');
  var chosen = null;

  quiz.addEventListener('change', function (e) {
    var input = e.target;
    if (!input || input.name !== 'concern') return;
    chosen = MAP[input.value] || null;
    var t = chosen && TIERS[chosen];

    if (t) {
      h.innerHTML = 'MOVES <span>' + t.name + '</span>';
      bars.setAttribute('data-level', String(t.level));
      copy.textContent = t.copy + CONFIRM;
      amt.textContent = t.amt;
      sub.textContent = 'a month, or ' + t.up + ' upfront';
    } else {
      h.innerHTML = 'Your expert <span>will confirm</span>';
      bars.setAttribute('data-level', '0');
      copy.textContent = 'Three Moves, three published prices.' + CONFIRM;
      amt.textContent = '£63';
      sub.textContent = 'a month, to start';
    }

    if (box && !reduceMotion) {
      box.classList.remove('is-updated');
      void box.offsetWidth;
      box.classList.add('is-updated');
    }
  });

  if (cta) {
    cta.addEventListener('click', function () {
      if (chosen) setTier(chosen);
    });
  }
})();
