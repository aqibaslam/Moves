'use client';

import { useEffect, useRef } from 'react';

/**
 * LandingReveal — staged section reveal for the /landing-2026 page. Mirrors
 * <FunnelReveal> (funnel-2026): as each section scrolls into view it fades in,
 * its lead heading bounces (hero headline types out), body content lifts with a
 * light stagger, cards scale in one after another, and the CTA eases in last.
 *
 * Classes are added to the EXISTING section element and its content — never to
 * wrapper <div>s — because the page relies on `.lp26 > X` direct-child selectors.
 * The reveal CSS is scoped to `.lp26` in landing-2026.css. Each section reveals
 * once (the observer unobserves it). `prefers-reduced-motion` or a missing
 * IntersectionObserver short-circuits to "just show everything".
 */

const HEADING_SELECTOR = 'h1,h2,h3,h4';
// Real call-to-action buttons only — they all carry `.btn`.
const CTA_SELECTOR = '.btn';
// Supporting content that lifts in with a small motion.
const BODY_SELECTOR = 'p,img,picture,figure,blockquote,ul,ol';
// Card grids reveal as whole units, one after another.
const CARD_SELECTOR =
  '.r2card, .pcard, .lp26-alone__card, .lp26-dentists__card, .ptile';
// Cap the body stagger so dense sections settle as a group.
const MAX_STEPS = 8;

/** Split a heading into per-character spans for a typewriter reveal, keeping
 * whole words unbreakable (`.tw-w`) and preserving inline markup (colour spans,
 * <br>). Each char gets a running `--tw-i` index the CSS reveals in sequence. */
function splitTypewriter(el: Element, state: { i: number }) {
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (!text) continue;
      const frag = document.createDocumentFragment();
      for (const part of text.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          continue;
        }
        const word = document.createElement('span');
        word.className = 'tw-w';
        for (const ch of part) {
          const c = document.createElement('span');
          c.className = 'tw-c';
          c.style.setProperty('--tw-i', String(state.i));
          c.textContent = ch;
          word.appendChild(c);
          state.i += 1;
        }
        frag.appendChild(word);
      }
      el.replaceChild(frag, node);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      !(node as Element).classList.contains('tw-w')
    ) {
      splitTypewriter(node as Element, state);
    }
  }
}

export function LandingReveal() {
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

    const isVisible = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 || r.height > 0;
    };

    const prime = (section: HTMLElement) => {
      section.classList.add('reveal-init');

      // Only the section's LEAD heading animates (first in DOM order).
      const lead = Array.from(
        section.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
      ).find(isVisible);
      if (lead) {
        if (lead.classList.contains('lp26-hero__title')) {
          // hero headline: typewriter.
          if (!lead.querySelector('.tw-c')) splitTypewriter(lead, { i: 0 });
          lead.classList.add('reveal-tw');
        } else {
          lead.classList.add('reveal-head');
          lead.style.transitionDelay = '240ms';
        }
      }

      // CTA(s) ease in slowly, last — skip any button inside a card.
      section.querySelectorAll<HTMLElement>(CTA_SELECTOR).forEach((el, i) => {
        if (!isVisible(el) || el.closest(CARD_SELECTOR)) return;
        el.classList.add('reveal-cta');
        el.style.transitionDelay = `${640 + i * 90}ms`;
      });

      // Card grids reveal as whole units, in sequence (a gentle per-card stagger).
      Array.from(section.querySelectorAll<HTMLElement>(CARD_SELECTOR)).forEach(
        (card, i) => {
          if (!isVisible(card)) return;
          const delay = 300 + Math.min(i, 9) * 190;
          card.style.setProperty('--rv-delay', `${delay}ms`);
          card.classList.add('reveal-c', 'reveal-card');
          card.style.transitionDelay = `${delay}ms`;
        },
      );

      // Body content lifts in, lightly staggered — only the OUTERMOST matches
      // (skip nested ones and anything inside a card).
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
        if (
          el.classList.contains('reveal-head') ||
          el.classList.contains('reveal-cta') ||
          el.closest(CARD_SELECTOR)
        ) {
          continue;
        }
        const tag = el.tagName;
        const isImg = tag === 'IMG' || tag === 'PICTURE' || tag === 'FIGURE';
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (isImg && (r.width < 64 || r.height < 64)) continue;

        el.classList.add('reveal-c');
        el.style.transitionDelay = `${300 + Math.min(step, MAX_STEPS) * 48}ms`;
        step += 1;
      }
    };

    const reveal = (section: Element) => {
      section.classList.add('reveal-in');
      section
        .querySelectorAll<HTMLElement>(
          '.reveal-head, .reveal-tw, .reveal-c, .reveal-cta',
        )
        .forEach((el) => {
          el.classList.add('reveal-in');
          // Once body / CTA / card elements land, strip their reveal classes so
          // their own styles (hover/press, etc.) take back over. Headings keep theirs.
          if (
            !el.classList.contains('reveal-head') &&
            !el.classList.contains('reveal-tw')
          ) {
            el.addEventListener(
              'transitionend',
              function done(e) {
                if (e.target !== el || !el.classList.contains('reveal-in')) return;
                el.classList.remove('reveal-c', 'reveal-card', 'reveal-cta', 'reveal-in');
                el.style.transitionDelay = '';
                el.style.removeProperty('--rv-delay');
              },
              { once: true },
            );
          }
        });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    );

    for (const section of sections) {
      prime(section);
      io.observe(section);
    }

    return () => io.disconnect();
  }, []);

  return <div ref={marker} aria-hidden style={{ display: 'none' }} />;
}
