(function () {
  'use strict';

  var root = document.querySelector('.lp');
  if (!root) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobileMq = window.matchMedia('(max-width: 1023px)');

  /* ---------- booking links: carry ad attribution into the GoHighLevel booking flow ---------- */
  (function () {
    var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
    var q = new URLSearchParams(location.search);
    var out = new URLSearchParams();
    KEYS.forEach(function (k) {
      var v = q.get(k);
      if (v) out.set(k, v.slice(0, 500));
    });
    out.set('lp', 'aligner-lander');
    out.set('from', location.pathname);
    var qs = out.toString();
    document.querySelectorAll('a[href="/book"]').forEach(function (a) {
      a.setAttribute('href', '/book?' + qs);
    });
  })();

  /* ---------- scroll reveal (hero excluded: first paint must be immediate) ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var groups = [
      '.lp-sec .lp-head > *',
      '.lp-qa-card',
      '.lp-fm-photo',
      '.lp-fm-panel',
      '.lp-v',
      '.lp-step',
      '.lp-wg-list li',
      '.lp-tabs',
      '.lp-p3',
      '.lp-incl',
      '.lp-faq-l',
      '.lp-q',
      '.lp-fin-in > *',
      '.lp-cta--sec',
    ];
    var targets = root.querySelectorAll(groups.join(','));
    targets.forEach(function (el) {
      el.setAttribute('data-reveal', '');
      var parent = el.parentElement;
      var idx = parent ? Array.prototype.indexOf.call(parent.children, el) : 0;
      el.style.transitionDelay = Math.min(idx, 4) * 80 + 'ms';
    });
    root.classList.add('lp-reveal-ready');

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('lp-revealed');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- carousels: progress dots (mobile / tablet) ---------- */
  root.querySelectorAll('[data-dots]').forEach(function (scroller) {
    var dotsEl = document.getElementById(scroller.getAttribute('data-dots'));
    if (!dotsEl) return;
    var items = scroller.firstElementChild ? scroller.firstElementChild.children : [];
    dotsEl.innerHTML = '';
    Array.prototype.forEach.call(items, function () {
      dotsEl.appendChild(document.createElement('i'));
    });
    function update() {
      var dots = dotsEl.children;
      if (!dots.length) return;
      var max = scroller.scrollWidth - scroller.clientWidth;
      var ratio = max > 0 ? scroller.scrollLeft / max : 0;
      var active = Math.round(ratio * (dots.length - 1));
      Array.prototype.forEach.call(dots, function (d, i) {
        d.classList.toggle('is-on', i === active);
      });
    }
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- how it works: rail progress ---------- */
  var steps = root.querySelectorAll('.lp-step');
  if (steps.length && 'IntersectionObserver' in window && !reduceMotion) {
    var so = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('is-on');
        });
      },
      { rootMargin: '0px 0px -45% 0px', threshold: 0 },
    );
    steps.forEach(function (s) {
      so.observe(s);
    });
  } else {
    steps.forEach(function (s) {
      s.classList.add('is-on');
    });
  }

  /* ---------- price tabs (mobile / tablet) ---------- */
  var tabs = root.querySelectorAll('.lp-tab');
  var cards = root.querySelectorAll('.lp-p3');
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
  var quiz = root.querySelector('#lp-quiz');
  if (quiz) {
    var TIERS = {
      one: { name: 'ONE', level: 1, amt: '£1,895' },
      core: { name: 'CORE', level: 2, amt: '£2,350' },
      complete: { name: 'COMPLETE', level: 3, amt: '£3,200' },
    };
    var MAP = { one: 'one', core: 'core', 'core-line': 'core', complete: 'complete' };
    var panel = quiz.querySelector('.lp-fm-panel');
    var h = quiz.querySelector('#lp-res-h');
    var bars = quiz.querySelector('#lp-res-bars');
    var amt = quiz.querySelector('#lp-res-amt');
    var sub = quiz.querySelector('#lp-res-sub');

    quiz.addEventListener('change', function (e) {
      var input = e.target;
      if (!input || input.name !== 'concern') return;
      var key = MAP[input.value];
      var t = key && TIERS[key];
      if (t) {
        h.innerHTML = 'MOVES <span>' + t.name + '</span>';
        bars.setAttribute('data-level', String(t.level));
        amt.textContent = t.amt;
        sub.textContent = 'Full treatment price';
      } else {
        h.innerHTML = 'Your dentist <span>will confirm</span>';
        bars.setAttribute('data-level', '0');
        amt.textContent = '£1,895';
        sub.textContent = 'From, full treatment price';
      }
      if (panel && !reduceMotion) {
        panel.classList.remove('is-updated');
        void panel.offsetWidth;
        panel.classList.add('is-updated');
      }
    });
  }

  /* ---------- sticky mobile CTA: appears once the hero button has scrolled away ---------- */
  var sticky = document.getElementById('lp-sticky');
  var heroCta = root.querySelector('.lp-hero .lp-btn');
  var finalCta = root.querySelector('.lp-fin .lp-btn');
  if (sticky && heroCta && 'IntersectionObserver' in window) {
    var heroGone = false;
    var finalSeen = false;
    var link = sticky.querySelector('a');
    function render() {
      var show = mobileMq.matches && heroGone && !finalSeen;
      sticky.classList.toggle('is-on', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (link) link.tabIndex = show ? 0 : -1;
    }
    new IntersectionObserver(
      function (entries) {
        // "gone" only once it has left through the top of the viewport
        var e = entries[0];
        heroGone = !e.isIntersecting && e.boundingClientRect.top < 0;
        render();
      },
      { threshold: 0 },
    ).observe(heroCta);
    if (finalCta) {
      new IntersectionObserver(
        function (entries) {
          finalSeen = entries[0].isIntersecting;
          render();
        },
        { threshold: 0 },
      ).observe(finalCta);
    }
    mobileMq.addEventListener('change', render);
  }
})();
