'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface BeforeAftersData {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  subtext?: string;
}

interface BaCard {
  before: string;
  after: string;
  name: string;
  quote: string;
  signed: string;
}

// Content from Figma (node 2061-3005). NOTE: the before/after photos are
// placeholders (reusing the existing ba-* images) until the real Figma exports
// are dropped into public/images.
const BASE: BaCard[] = [
  {
    before: 'ba-daniel-before',
    after: 'ba-daniel-after',
    name: 'Daniel K.',
    quote:
      '“The check-ins kept me motivated, and my smile changed exactly as the plan showed. I’m really pleased with the result.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-sophie-before',
    after: 'ba-sophie-after',
    name: 'Sophie L.',
    quote:
      '“I wanted straighter teeth without making treatment a big part of my life. The aligners fitted easily around everything.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-adam-before',
    after: 'ba-adam-after',
    name: 'Adam J.',
    quote:
      '“My front teeth had bothered me for years. Now I smile naturally without thinking about how my teeth look.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-claire-before',
    after: 'ba-claire-after',
    name: 'Claire B.',
    quote:
      '“I thought I had left it too late to straighten my teeth. The process was comfortable, supportive and easier than expected.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-james-before',
    after: 'ba-james-after',
    name: 'James T.',
    quote:
      '“The treatment plan gave me a clear timeline from the beginning. Everything stayed on track, with support whenever I needed it.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-hannah-before',
    after: 'ba-hannah-after',
    name: 'Hannah W.',
    quote:
      '“My teeth were something I always noticed in photos. Now my smile is the first thing I actually like about them.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-aisha-before',
    after: 'ba-aisha-after',
    name: 'Aisha R.',
    quote:
      '“The changes were gradual, but every new tray brought me closer. Seeing the final comparison made it completely worth it.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-emily-before',
    after: 'ba-emily-after',
    name: 'Emily R.',
    quote:
      '“I could see a difference within the first few trays. The whole process felt simple, clear and completely manageable.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
];

const AUTOPLAY_MS = 3000;

export function BeforeAfters({ data }: { data?: BeforeAftersData }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const cards = BASE.map((c) => ({
    before: `/images/${c.before}.png`,
    after: `/images/${c.after}.png`,
    name: c.name,
    quote: c.quote,
    signed: c.signed,
    gdc: 'GDC: 251837',
  }));
  const DOTS = cards.length;
  // render the set twice so auto-play can wrap seamlessly (infinite loop)
  const loop = [...cards, ...cards];

  // width of one card + gap — the amount to move per step
  const cardStep = () => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>('.bacard');
    return card ? card.offsetWidth + 4 : 0;
  };
  const maxScroll = () => {
    const el = trackRef.current;
    return el ? el.scrollWidth - el.clientWidth : 0;
  };

  const syncActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.bacard');
    const step = card ? card.offsetWidth + 4 : 0;
    const idx = step > 0 ? Math.round(el.scrollLeft / step) : 0;
    setActive(((idx % DOTS) + DOTS) % DOTS);
  }, [DOTS]);

  const goToDot = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: Math.min(i * cardStep(), maxScroll()), behavior: 'smooth' });
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

  // Auto-play: advance one card at a time and loop back at the end. Pauses while
  // the user is interacting (hover / drag) and for reduced-motion users.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const step = cardStep();
      const setWidth = step * cards.length;
      // once we've scrolled a full set into the duplicate, jump back by one set
      // instantly — the cards are identical, so the loop is seamless
      if (el.scrollLeft >= setWidth - 2) el.scrollLeft -= setWidth;
      el.scrollBy({ left: step, behavior: 'smooth' });
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  // drag-to-scroll (refs so dragging doesn't re-render on every move)
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });
  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    setPaused(true);
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
        <p className="eyebrow">{data?.eyebrow ?? 'BEFORE AND AFTERS'}</p>
        <h2 className="h-section">
          <span className="c">{data?.heading?.accent ?? 'Real moves.'}</span>{' '}
          {data?.heading?.rest ?? 'Signed.'}
        </h2>
        <p className="lead">
          {data?.subtext ??
            'Every case unretouched, originals on file, signed by the dentist responsible.'}
        </p>
      </div>

      <div
        className="ba__cards"
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="group"
        aria-label="Before and after case studies"
      >
        {loop.map((c, i) => (
          <article className="bacard" key={`${c.name}-${i}`}>
            <div className="bacard__imgs">
              <div className="bacard__img">
                <span className="ba-chip">Before</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.before} alt={`${c.name} before`} draggable={false} />
              </div>
              <div className="bacard__img">
                <span className="ba-chip">After</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.after} alt={`${c.name} after`} draggable={false} />
              </div>
            </div>
            <h3 className="bacard__name">{c.name}</h3>
            <p className="bacard__quote">{c.quote}</p>
            <div className="bacard__foot">
              <span className="bacard__signed">{c.signed}</span>
              <span className="gdc-pill">{c.gdc}</span>
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
