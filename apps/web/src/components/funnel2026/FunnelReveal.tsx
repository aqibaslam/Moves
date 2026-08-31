'use client';

import { useEffect, useRef } from 'react';

/**
 * FunnelReveal — a staged section reveal for the /funnel-2026 page.
 *
 * As each section scrolls into view, the sequence is:
 *   1. the section fades in (the container / "load"),
 *   2. the heading BOUNCES in (spring overshoot),
 *   3. the body content (paragraphs, images, lists…) LIFTS in with a small,
 *      subtle rise + a light stagger — so everything has motion, not just the
 *      heading,
 *   4. the CTA eases in SLOWLY — last, for emphasis.
 *
 * Mechanics — classes go on the EXISTING section element and its content
 * elements, never on wrapper <div>s (the page layout relies on
 * `.moves-page > X` direct-child selectors, which wrapping would break). The
 * section is hidden with `.reveal-init` (OPACITY only — a section transform
 * would shift its scroll-snap point); its heading / body / CTA are held back
 * with `.reveal-head` / `.reveal-c` / `.reveal-cta` and their own inline delay.
 * Those transforms live on descendants, so they don't affect the section's snap
 * box. Everything fires when the section's IntersectionObserver entry turns
 * visible (`.reveal-in`). A missing IntersectionObserver or
 * `prefers-reduced-motion` both short-circuit to "just show everything".
 */

const HEADING_SELECTOR = 'h1,h2,h3,h4';
// Only the real call-to-action buttons ("Book Free Consultation", "Submit") —
// they all carry `.btn`. Deliberately NOT `button`, which would also grab
// carousel dots, plan toggles, FAQ accordion triggers, avatars, play buttons…
const CTA_SELECTOR = '.btn';
// The supporting content that lifts in with a small motion. Semantic + specific
// so we never grab a section/layout wrapper.
const BODY_SELECTOR = 'p,img,picture,figure,blockquote,ul,ol';
// Card grids (Before & After slider, pricing tiers, candidacy cards, What's-
// included features) reveal as whole units, one after another — not by animating
// each element inside them.
const CARD_SELECTOR =
  '.bacard, .fpcard, .f-cand__card, .f26-incl__card, .ptile';
// Cap the body stagger so dense sections (the gallery) settle as a group rather
// than dribbling in one-by-one.
const MAX_STEPS = 8;

export function FunnelReveal() {
  const marker = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = marker.current?.parentElement;
    if (!root) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const sections = Array.from(root.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && el !== marker.current,
    );

    // Section scroll-snap: each section clicks to the top of the viewport as you
    // scroll to it. Enabled here (not in global CSS) so it's scoped to this page
    // and removed on leave. `proximity`, not `mandatory` — several sections are
    // taller than the viewport (the Before & After gallery is ~2× tall), and
    // mandatory would trap the reader mid-section. `.snap-on` gates the per-
    // section `scroll-snap-align` in CSS.
    const docEl = document.documentElement;
    const prevSnapType = docEl.style.scrollSnapType;
    docEl.style.scrollSnapType = 'y proximity';
    root.classList.add('snap-on');

    const isVisible = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 || r.height > 0;
    };

    const prime = (section: HTMLElement) => {
      section.classList.add('reveal-init');

      // Only the section's LEAD heading bounces — not every sub-heading (dentist
      // names, testimonial authors, plan titles). Those just arrive with the
      // section. The lead heading is the first one in DOM order.
      const lead = Array.from(
        section.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
      ).find(isVisible);
      if (lead) {
        lead.classList.add('reveal-head');
        lead.style.transitionDelay = '240ms';
      }

      // CTA(s) ease in slowly, last — but skip any button inside a card (it
      // reveals as part of that card's unit above).
      section.querySelectorAll<HTMLElement>(CTA_SELECTOR).forEach((el, i) => {
        if (!isVisible(el) || el.closest(CARD_SELECTOR)) return;
        el.classList.add('reveal-cta');
        el.style.transitionDelay = `${640 + i * 90}ms`;
      });

      // Card grids reveal as whole units, in sequence (first card, second,
      // third…) — a gentle per-card stagger. The images inside are NOT animated
      // separately (skipped in the body loop below).
      Array.from(section.querySelectorAll<HTMLElement>(CARD_SELECTOR)).forEach(
        (card, i) => {
          if (!isVisible(card)) return;
          // cap at 9 so an 8-card grid (What's-included) still staggers fully.
          const delay = 300 + Math.min(i, 9) * 190;
          // `--rv-delay` on every card lets child reveals (e.g. the heading
          // bounce) sync to the card's own stagger.
          card.style.setProperty('--rv-delay', `${delay}ms`);
          if (card.classList.contains('fpcard')) {
            // pricing tiers: a clean "open wipe" — a clip-path smoothly wipes the
            // card open top→bottom.
            card.classList.add('reveal-open');
          } else {
            // other cards: a graceful scale-in.
            card.classList.add('reveal-c', 'reveal-card');
            card.style.transitionDelay = `${delay}ms`;
          }
        },
      );

      // Body content lifts in with a small motion, lightly staggered — so the
      // supporting content moves too, not just the heading + CTA.
      const matches = Array.from(
        section.querySelectorAll<HTMLElement>(BODY_SELECTOR),
      );
      const set = new Set(matches);
      const outer = matches.filter((el) => {
        let p = el.parentElement;
        while (p && p !== section) {
          if (set.has(p)) return false;
          p = p.parentElement;
        }
        return true;
      });

      let step = 0;
      for (const el of outer) {
        // don't double-tag something already claimed as heading / CTA, skip
        // anything inside a card (reveals as a unit above), and skip the coral
        // portrait (it has its own zoom-settle + hover pan, driven in CSS)
        if (
          el.classList.contains('reveal-head') ||
          el.classList.contains('reveal-cta') ||
          el.closest(CARD_SELECTOR) ||
          el.closest('.fb-coral__figure') ||
          el.classList.contains('f26-incl__product')
        ) {
          continue;
        }
        const tag = el.tagName;
        const isImg = tag === 'IMG' || tag === 'PICTURE' || tag === 'FIGURE';
        const r = el.getBoundingClientRect();
        // skip hidden elements and tiny icons (stars, checkmarks, glyphs)
        if (r.width === 0 && r.height === 0) continue;
        if (isImg && (r.width < 64 || r.height < 64)) continue;

        el.classList.add('reveal-c');
        el.style.transitionDelay = `${300 + Math.min(step, MAX_STEPS) * 48}ms`;
        step += 1;
      }
    };

    const reveal = (section: Element) => {
      section.classList.add('reveal-in');

      // The What's-included product image sways left↔right a few times as it
      // arrives. Driven by a transient class (removed on animationend) so it
      // never fights the hover wobble (both animate `transform`).
      const product = section.querySelector<HTMLElement>('.f26-incl__product');
      if (product) {
        product.classList.add('is-sway');
        product.addEventListener('animationend', function done(e) {
          if (e.target !== product) return;
          product.classList.remove('is-sway');
          product.removeEventListener('animationend', done);
        });
      }
      section
        .querySelectorAll<HTMLElement>(
          '.reveal-head, .reveal-c, .reveal-cta, .reveal-open',
        )
        .forEach((el) => {
          el.classList.add('reveal-in');
          // Once a body / CTA / card element has landed, strip its reveal
          // classes so its own styles (button hover/press, etc.) take back over
          // cleanly. Headings keep theirs (no hover, nothing to restore).
          if (!el.classList.contains('reveal-head')) {
            el.addEventListener('transitionend', function done(e) {
              // Fire once the element's own reveal ends. Animated property is
              // `translate`/`scale` for body/CTA/cards and `clip-path` for the
              // pricing open-wipe — any, on the element itself, is a safe point.
              // Guard on reveal-in: if the section scrolled out mid-reveal and
              // was reset (reveal-in already stripped), this is the reverse
              // transition — don't clean up (that would un-hide the element).
              if (e.target !== el || !el.classList.contains('reveal-in')) return;
              el.classList.remove(
                'reveal-c',
                'reveal-card',
                'reveal-cta',
                'reveal-open',
                'reveal-in',
              );
              el.style.transitionDelay = '';
              el.style.removeProperty('--rv-delay');
            }, { once: true });
          }
        });
    };

    // Reset a section back to its hidden state so it can replay next time it
    // scrolls into view: strip every `.reveal-in` (and any transient animation
    // class), then re-prime the hidden classes (cards/CTAs/body were cleaned up
    // when they settled, so re-priming re-hides them). Runs while the section is
    // OFF-screen, so the re-hide is never visible.
    const resetSection = (section: HTMLElement) => {
      section.classList.remove('reveal-in');
      section
        .querySelectorAll('.reveal-in')
        .forEach((el) => el.classList.remove('reveal-in'));
      section
        .querySelectorAll('.is-sway')
        .forEach((el) => el.classList.remove('is-sway'));
      prime(section);
    };

    // Re-arm on every scroll (no unobserve): reveal on entry, reset on exit, so
    // the animations play again each time you scroll a section back into view.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            if (section.dataset.rvShown !== '1') {
              section.dataset.rvShown = '1';
              reveal(section);
            }
          } else if (section.dataset.rvShown === '1') {
            section.dataset.rvShown = '';
            resetSection(section);
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    );

    for (const section of sections) {
      prime(section);
      io.observe(section);
    }

    return () => {
      io.disconnect();
      docEl.style.scrollSnapType = prevSnapType;
      root.classList.remove('snap-on');
    };
  }, []);

  return <div ref={marker} aria-hidden style={{ display: 'none' }} />;
}
