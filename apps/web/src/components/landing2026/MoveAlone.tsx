'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

/* "You're not making this move alone" (Figma node 413:9684). Three cards:
   a chat mock-up, a live treatment-plan panel, and an outdoor portrait — each
   with a two-tone heading (red accent on the closing phrase). On mobile the
   cards become a swipeable carousel with dot pagination. */
export function MoveAlone() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState(0);
  const COUNT = 3;

  // Treatment-plan sliders are draggable (0→12, Low→High, Current→Next).
  const [align, setAlign] = useState(6); // stage 6 of 12
  const [bite, setBite] = useState(55); // Low → High
  const [smile, setSmile] = useState(42); // Current → Next
  const pct = (v: number, max: number) => ({ ['--pct']: `${(v / max) * 100}%` } as CSSProperties);

  // auto-advance pauses briefly while the user is swiping/tapping, then resumes
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<number | null>(null);
  const pauseBriefly = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), 4000);
  }, []);

  const stepPx = () => {
    const el = gridRef.current;
    if (!el) return 0;
    const cards = el.querySelectorAll<HTMLElement>('.lp26-alone__card');
    return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0]?.offsetWidth ?? 0;
  };
  const syncDot = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    const step = stepPx();
    const idx = step > 0 ? Math.round(el.scrollLeft / step) : 0;
    setDot(Math.max(0, Math.min(idx, COUNT - 1)));
  }, []);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncDot, { passive: true });
    window.addEventListener('resize', syncDot);
    syncDot();
    return () => {
      el.removeEventListener('scroll', syncDot);
      window.removeEventListener('resize', syncDot);
    };
  }, [syncDot]);
  const goToDot = (i: number) => gridRef.current?.scrollTo({ left: i * stepPx(), behavior: 'smooth' });

  // Mobile: auto-advance the carousel in a continuous loop (0→1→2→0…). Desktop
  // shows all three side-by-side, so it's mobile-only; disabled for reduced-motion.
  useEffect(() => {
    if (paused || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      // re-check each tick so it turns on/off as the viewport crosses 900px
      if (!window.matchMedia('(max-width: 900px)').matches) return;
      setDot((d) => {
        const next = (d + 1) % COUNT;
        gridRef.current?.scrollTo({ left: next * stepPx(), behavior: 'smooth' });
        return next;
      });
    }, 3500);
    return () => window.clearInterval(id);
  }, [paused]);
  useEffect(() => () => { if (resumeTimer.current) window.clearTimeout(resumeTimer.current); }, []);

  return (
    <section className="lp26-alone card-section">
      <div className="lp26-alone__head">
        <h2 className="lp26-alone__title">
          You&rsquo;re not making this <span className="ink-red">move alone</span>
        </h2>
        <p className="lp26-alone__sub">
          From your first scan to your final reveal, your MOVES team stays involved reviewing
          progress, answering questions, and adjusting your treatment when needed.
        </p>
      </div>

      <div
        className="lp26-alone__grid"
        ref={gridRef}
        onPointerDown={pauseBriefly}
        onTouchStart={pauseBriefly}
      >
        {/* card 1 — chat / support */}
        <article className="lp26-alone__card lp26-alone__card--light">
          <h3 className="lp26-alone__ctitle">
            Support that moves
            <br />
            <span className="ink-red">with you</span>
          </h3>
          {/* Figma composite (node 413:9684): dentist on the blue gradient with the
              two chat bubbles + circle baked in, shown inside a phone mock-up that
              bleeds off the bottom of the card. Bubble text kept in alt for a11y. */}
          <div className="lp26-alone__phone">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="lp26-alone__support"
              src="/images/lp26-support.png"
              alt="Chat with a MOVES dentist — “Hi! I’ve got a quick question about my aligners.” “Of course. Your MOVES team is here to support you through every stage of your treatment.”"
            />
          </div>
        </article>

        {/* card 2 — treatment plan panel */}
        <article className="lp26-alone__card lp26-alone__card--dark">
          <h3 className="lp26-alone__ctitle lp26-alone__ctitle--light">
            Treatment review and stage adjustments if <span className="ink-red">needed</span>
          </h3>
          <div className="lp26-plan">
            <div className="lp26-plan__top">
              <span className="lp26-plan__name">Your Treatment Plan</span>
              <span className="lp26-plan__date">March 20 2026</span>
            </div>
            <div className="lp26-plan__row">
              <p className="lp26-plan__label">Alignment Progress</p>
              <p className="lp26-plan__meta">Stage {align} Of 12</p>
              <div className="lp26-plan__slider" style={pct(align, 12)}>
                <input
                  type="range"
                  className="lp26-plan__range"
                  min={0}
                  max={12}
                  value={align}
                  onChange={(e) => setAlign(+e.target.value)}
                  aria-label="Alignment progress, 0 to 12"
                />
                <span className="lp26-plan__fill" aria-hidden="true" />
                <span className="lp26-plan__knob" aria-hidden="true" />
                <span className="lp26-plan__cap lp26-plan__cap--start">0</span>
                <span className="lp26-plan__cap lp26-plan__cap--end">12</span>
              </div>
            </div>
            <div className="lp26-plan__row">
              <p className="lp26-plan__label">Bite Correction</p>
              <p className="lp26-plan__meta">On Track</p>
              <div className="lp26-plan__slider" style={pct(bite, 100)}>
                <input
                  type="range"
                  className="lp26-plan__range"
                  min={0}
                  max={100}
                  value={bite}
                  onChange={(e) => setBite(+e.target.value)}
                  aria-label="Bite correction, low to high"
                />
                <span className="lp26-plan__fill" aria-hidden="true" />
                <span className="lp26-plan__knob" aria-hidden="true" />
                <span className="lp26-plan__cap lp26-plan__cap--start">Low</span>
                <span className="lp26-plan__cap lp26-plan__cap--end">High</span>
              </div>
            </div>
            <div className="lp26-plan__row">
              <p className="lp26-plan__label">Smile Refinement</p>
              <p className="lp26-plan__meta">Refinement Planned</p>
              <div className="lp26-plan__slider" style={pct(smile, 100)}>
                <input
                  type="range"
                  className="lp26-plan__range"
                  min={0}
                  max={100}
                  value={smile}
                  onChange={(e) => setSmile(+e.target.value)}
                  aria-label="Smile refinement, current to next"
                />
                <span className="lp26-plan__fill" aria-hidden="true" />
                <span className="lp26-plan__knob" aria-hidden="true" />
                <span className="lp26-plan__cap lp26-plan__cap--start">Current</span>
                <span className="lp26-plan__cap lp26-plan__cap--end">Next</span>
              </div>
            </div>
          </div>
        </article>

        {/* card 3 — ongoing support photo */}
        <article className="lp26-alone__card lp26-alone__card--photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/lp26-ongoing.png" alt="A person smiling outdoors" />
          <h3 className="lp26-alone__ctitle lp26-alone__ctitle--over">
            Ongoing support not one-time <span className="ink-red">treatment.</span>
          </h3>
        </article>
      </div>

      {/* mobile pagination */}
      <div className="lp26-alone__dots" role="tablist" aria-label="Cards">
        {Array.from({ length: COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`lp26-alone__dot${i === dot ? ' is-active' : ''}`}
            aria-label={`Go to card ${i + 1}`}
            aria-selected={i === dot}
            onClick={() => goToDot(i)}
          />
        ))}
      </div>
    </section>
  );
}
