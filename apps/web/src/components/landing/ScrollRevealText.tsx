'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-linked word highlight, à la the reference "v2-testimonial":
 * every word starts dim and brightens one-by-one as the block scrolls
 * up through the viewport. Colours are defined in CSS via `.reveal-word`
 * / `.reveal-word.is-lit`, so callers keep full control of the palette.
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

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // start lighting when the block enters the lower 90% of the viewport,
      // finish once it reaches ~30% from the top — a controlled scroll reveal.
      const start = vh * 0.9;
      const end = vh * 0.3;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setLit(Math.ceil(p * words.length));
    };

    // A rAF loop that runs only while the heading is on screen. Scroll events
    // alone are throttled during momentum/inertial scrolling on mobile
    // (esp. iOS), which makes the word-by-word reveal skip — the frame loop
    // keeps it smooth there.
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
