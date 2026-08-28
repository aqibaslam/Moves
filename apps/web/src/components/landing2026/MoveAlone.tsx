'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* "You're not making this move alone" (Figma node 413:9684). Three cards:
   a chat mock-up, a live treatment-plan panel, and an outdoor portrait — each
   with a two-tone heading (red accent on the closing phrase). On mobile the
   cards become a swipeable carousel with dot pagination. */
export function MoveAlone() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState(0);
  const COUNT = 3;

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

      <div className="lp26-alone__grid" ref={gridRef}>
        {/* card 1 — chat / support */}
        <article className="lp26-alone__card lp26-alone__card--light">
          <h3 className="lp26-alone__ctitle">
            Support that moves <span className="ink-red">with you</span>
          </h3>
          <div className="lp26-alone__phone">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/team-photo.png" alt="A MOVES dentist" />
            <span className="lp26-alone__bubble lp26-alone__bubble--out">
              Hi! I&rsquo;ve got a quick question about my aligners.
            </span>
            <span className="lp26-alone__bubble lp26-alone__bubble--in">
              Of course. Your MOVES team is here to support you through every stage of your treatment.
            </span>
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
              <p className="lp26-plan__meta">Stage 6 Of 12</p>
              <div className="lp26-plan__track"><span style={{ left: '50%' }} /></div>
              <div className="lp26-plan__scale"><span>0</span><span>12</span></div>
            </div>
            <div className="lp26-plan__row">
              <p className="lp26-plan__label">Bite Correction</p>
              <p className="lp26-plan__meta">On Track</p>
              <div className="lp26-plan__track"><span style={{ left: '52%' }} /></div>
              <div className="lp26-plan__scale"><span>Low</span><span>High</span></div>
            </div>
            <div className="lp26-plan__row">
              <p className="lp26-plan__label">Smile Refinement</p>
              <p className="lp26-plan__meta">Refinement Planned</p>
              <div className="lp26-plan__track"><span style={{ left: '40%' }} /></div>
              <div className="lp26-plan__scale"><span>Current</span><span>Next</span></div>
            </div>
          </div>
        </article>

        {/* card 3 — ongoing support photo */}
        <article className="lp26-alone__card lp26-alone__card--photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cta-woman.png" alt="A person smiling outdoors" />
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
