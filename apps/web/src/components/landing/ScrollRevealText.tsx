'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-linked heading reveal (attio-style, heading-only — nothing else in
 * the section moves). Each word's brightness is driven *continuously* by
 * scroll via a `--t` custom property (0 = dim, 1 = lit), so the reveal is
 * smooth rather than snapping — and it can't get stuck like a CSS transition
 * fighting the rAF loop. Colours live in CSS (`.reveal-word`).
 */
export function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(/\s+/).filter(Boolean);
  // `front` is a float: how many words in the reveal has reached (with a
  // fractional part for the word currently fading in).
  const [front, setFront] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFront(words.length);
      return;
    }

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Begin once the heading reaches the middle of the viewport, then reveal
      // as it scrolls up toward the top — a slow, controlled span. Nothing in
      // the layout moves; only the word colours change.
      const start = vh * 0.6;
      const end = vh * 0.08;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setFront(p * words.length);
    };

    // rAF loop while the heading is on screen — keeps the reveal smooth during
    // momentum/inertial scrolling where scroll events alone are throttled.
    let raf = 0;
    let running = false;
    const loop = () => {
      update();
      if (running) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
          update();
        }
      },
      { rootMargin: '0px', threshold: 0 },
    );
    io.observe(el);

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [words.length]);

  return (
    <span ref={ref} className="reveal">
      {words.map((w, i) => {
        // each word fades in over ~1 word of scroll — a smooth moving gradient
        const t = Math.min(1, Math.max(0, front - i));
        return (
          <span
            key={i}
            className="reveal-word"
            style={{ ['--t' as string]: t }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}
