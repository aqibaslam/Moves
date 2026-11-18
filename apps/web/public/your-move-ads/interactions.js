(function () {
  'use strict';

  var root = document.querySelector('.mp-ads-page');
  if (!root) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll-reveal ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    // Deliberately excludes the hero (header's own section): it's the
    // first thing a visitor sees with no scroll required, so it must
    // render immediately — never start hidden and wait on a transition.
    var revealSelectors = [
      '.mp-head .mp-chip',
      '.mp-head .mp-h2',
      '.mp-fx',
      '.mp-fm-shot',
      '.mp-vgrid > li',
      '.mp-tl-row',
      '.mp-vs3-c',
      '.mp-p3',
      '.mp-faq-l',
      '.mp-q',
      '.mp-fin-in > *',
      '.mp-ft2-cta',
    ];
    var targets = root.querySelectorAll(revealSelectors.join(','));
    if (targets.length) {
      targets.forEach(function (el, i) {
        el.setAttribute('data-reveal', '');
        // Small stagger within a row/grid so groups don't pop in as one block.
        el.style.transitionDelay = Math.min(i % 6, 5) * 70 + 'ms';
      });
      root.classList.add('mp-reveal-ready');

      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('mp-revealed');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
      );
      targets.forEach(function (el) {
        io.observe(el);
      });
    }
  }

  /* ---------- "Find your Move" quiz: picking an option updates the result copy ---------- */
  var quiz = root.querySelector('#mp-quiz');
  if (quiz) {
    var headline = quiz.querySelector('#mp-fr-headline');
    var labels = {
      drifted: 'A tooth or two? That’s a MOVES ONE.',
      gaps: 'Small gaps close fast with MOVES CORE.',
      'out-of-line': 'A few teeth out of line? MOVES CORE.',
      crowding: 'Crowding and bite — that’s MOVES COMPLETE.',
      unsure: 'Not sure yet? The free call will tell you.',
    };
    quiz.addEventListener('change', function (e) {
      var input = e.target;
      if (!input || input.name !== 'concern') return;
      if (headline && labels[input.value]) {
        headline.textContent = labels[input.value];
      }
    });
  }

  /* ---------- video testimonial cards: no video source yet, keep inert ---------- */
  // Intentionally no click handler — these play buttons are a visual
  // affordance only until real video URLs are supplied for Carla / Jade /
  // Darcy / Chuko. Wire a lightbox here once they exist.
})();
