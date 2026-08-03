'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-linked heading reveal (attio-style, heading-only — nothing else in
 * the section moves). Words start dim grey and brighten to white a couple at
 * a time as the heading scrolls up through the viewport. Colours live in CSS
 * (`.reveal-word` / `.reveal-word.is-lit`).
 */
export function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(/\s+/).filter(Boolean);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLit(words.length);
      return;
    }

    // reveal ~2 words per step so it moves in small groups, not one snap
    const STEP = 2;
    const steps = Math.max(1, Math.ceil(words.length / STEP));

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Start as the heading enters from the bottom of the viewport and finish
      // as it reaches the upper third — a full-viewport span so it reveals
      // slowly and stays readable once complete. The heading itself doesn't
      // move the layout; only the word colours change.
      const start = vh * 1.0;
      const end = vh * 0.28;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setLit(Math.min(words.length, Math.ceil(p * steps) * STEP));
    };

    // rAF loop while on screen keeps it smooth during momentum scrolling.
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
      {words.map((w, i) => (
        <span key={i} className={`reveal-word${i < lit ? ' is-lit' : ''}`}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
