'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const BASE = [
  {
    before: 'ba-1-before',
    after: 'ba-1-after',
    name: 'Lisa A.',
    quote:
      '“I started eight months before my wedding so I wouldn’t spend the photos doing my careful smile. Best line in the whole planning spreadsheet.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-2-before',
    after: 'ba-2-after',
    name: 'Priya R.',
    quote:
      '“I used to talk with my hand near my mouth without noticing. Now I catch myself grinning in meetings. Nobody warned me about that part.”',
    signed: 'Signed by Dr. Amir Hussain',
  },
  {
    before: 'ba-2-before',
    after: 'ba-2-after',
    name: 'Sarah M.',
    quote:
      '“Fourteen weeks. The plan on my screen said fourteen weeks, and it was fourteen weeks. I’ve had sofas take longer to arrive.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-4-before',
    after: 'ba-4-after',
    name: 'Tom W.',
    quote:
      '“I stopped editing my smile out of photos, then noticed I’d started smiling in them. That’s the whole review, really.”',
    signed: 'Signed by Dr. Amir Hussain',
  },
];

// The design shows more cards than fit — duplicate the set so the track scrolls.
const CARDS = [...BASE, ...BASE];

const DOTS = 6;

export function BeforeAfters() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // drag-to-scroll state (refs so dragging doesn't re-render on every move)
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const maxScroll = () => {
    const el = trackRef.current;
    return el ? el.scrollWidth - el.clientWidth : 0;
  };

  const syncActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    setActive(Math.round(ratio * (DOTS - 1)));
  }, []);

  const goToDot = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: (i / (DOTS - 1)) * maxScroll(), behavior: 'smooth' });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncActive, { passive: true });
    window.addEventListener('resize', syncActive);
    syncActive();
    return () => {
      el.removeEventListener('scroll', syncActive);
      window.removeEventListener('resize', syncActive);
    };
  }, [syncActive]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    // Only take over dragging for mouse; touch/pen use native momentum scroll.
    if (!el || e.pointerType !== 'mouse') return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
    el.classList.add('dragging');
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = () => {
    const el = trackRef.current;
    if (!el) return;
    drag.current.down = false;
    el.classList.remove('dragging');
  };

  return (
    <section className="card-section ba">
      <div className="ba__head">
        <p className="eyebrow">BEFORE AND AFTERS</p>
        <h2 className="h-section">
          <span className="c">Real moves.</span> Signed.
        </h2>
        <p className="lead">
          Every case unretouched, originals on file, signed by the dentist responsible.
        </p>
      </div>

      <div
        className="ba__cards"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        role="group"
        aria-label="Before and after case studies"
      >
        {CARDS.map((c, i) => (
          <article className="bacard" key={`${c.name}-${i}`}>
            <div className="bacard__imgs">
              <div className="bacard__img">
                <span className="ba-chip">Before</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/${c.before}.png`} alt={`${c.name} before`} draggable={false} />
              </div>
              <div className="bacard__img">
                <span className="ba-chip">After</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/${c.after}.png`} alt={`${c.name} after`} draggable={false} />
              </div>
            </div>
            <h3 className="bacard__name">{c.name}</h3>
            <p className="bacard__quote">{c.quote}</p>
            <div className="bacard__foot">
              <span className="bacard__signed">{c.signed}</span>
              <span className="gdc-pill">GDC: 251837</span>
            </div>
          </article>
        ))}
      </div>

      <div className="dots" role="tablist" aria-label="Slider pages">
        {Array.from({ length: DOTS }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`dots__btn${i === active ? ' on' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === active}
            onClick={() => goToDot(i)}
          />
        ))}
      </div>
    </section>
  );
}
