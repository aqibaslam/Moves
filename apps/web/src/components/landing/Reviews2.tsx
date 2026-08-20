'use client';

/* 2.0 "Real moves. Signed." — before/after + signed-testimonial cards
   (Figma node 66:199). Auto-playing carousel: advances one card at a time,
   supports drag / scroll, and mirrors the homepage <BeforeAfters> behaviour.
   Slides are the same eight cases used on the homepage. */

import { useCallback, useEffect, useRef, useState } from 'react';

interface R2Card {
  name: string;
  quote: string;
  signedBy: string;
  before: string;
  after: string;
}

// Same eight cases as the homepage <BeforeAfters> slider.
const CARDS: R2Card[] = [
  {
    name: 'Daniel K.',
    quote:
      'The check-ins kept me motivated, and my smile changed exactly as the plan showed. I’m really pleased with the result.',
    signedBy: 'Signed by Dr. Amelia Hart',
    before: '/images/ba-daniel-before.png',
    after: '/images/ba-daniel-after.png',
  },
  {
    name: 'Sophie L.',
    quote:
      'I wanted straighter teeth without making treatment a big part of my life. The aligners fitted easily around everything.',
    signedBy: 'Signed by Dr. Amelia Hart',
    before: '/images/ba-sophie-before.png',
    after: '/images/ba-sophie-after.png',
  },
  {
    name: 'Adam J.',
    quote:
      'My front teeth had bothered me for years. Now I smile naturally without thinking about how my teeth look.',
    signedBy: 'Signed by Dr. Amelia Hart',
    before: '/images/ba-adam-before.png',
    after: '/images/ba-adam-after.png',
  },
  {
    name: 'Claire B.',
    quote:
      'I thought I had left it too late to straighten my teeth. The process was comfortable, supportive and easier than expected.',
    signedBy: 'Signed by Dr. Amelia Hart',
    before: '/images/ba-claire-before.png',
    after: '/images/ba-claire-after.png',
  },
  {
    name: 'James T.',
    quote:
      'The treatment plan gave me a clear timeline from the beginning. Everything stayed on track, with support whenever I needed it.',
    signedBy: 'Signed by Dr. Amelia Hart',
    before: '/images/ba-james-before.png',
    after: '/images/ba-james-after.png',
  },
  {
    name: 'Hannah W.',
    quote:
      'My teeth were something I always noticed in photos. Now my smile is the first thing I actually like about them.',
    signedBy: 'Signed by Dr. Amelia Hart',
    before: '/images/ba-hannah-before.png',
    after: '/images/ba-hannah-after.png',
  },
  {
    name: 'Aisha R.',
    quote:
      'The changes were gradual, but every new tray brought me closer. Seeing the final comparison made it completely worth it.',
    signedBy: 'Signed by Dr. Amelia Hart',
    before: '/images/ba-aisha-before.png',
    after: '/images/ba-aisha-after.png',
  },
  {
    name: 'Emily R.',
    quote:
      'I could see a difference within the first few trays. The whole process felt simple, clear and completely manageable.',
    signedBy: 'Signed by Dr. Amelia Hart',
    before: '/images/ba-emily-before.png',
    after: '/images/ba-emily-after.png',
  },
];

const AUTOPLAY_MS = 3000;
const GAP = 4; // must match .reviews2__row gap

export interface Reviews2Data {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  subtext?: string;
}

export function Reviews2({ data }: { data?: Reviews2Data }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const DOTS = CARDS.length;
  // render the set twice so auto-play can wrap seamlessly (infinite loop)
  const loop = [...CARDS, ...CARDS];

  // width of one card + gap — the amount to move per step
  const cardStep = () => {
    const card = trackRef.current?.querySelector<HTMLElement>('.r2card');
    return card ? card.offsetWidth + GAP : 0;
  };
  const maxScroll = () => {
    const el = trackRef.current;
    return el ? el.scrollWidth - el.clientWidth : 0;
  };

  const syncActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.r2card');
    const step = card ? card.offsetWidth + GAP : 0;
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
      const setWidth = step * CARDS.length;
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
    <section className="card-section reviews2">
      <div className="reviews2__head">
        <p className="eyebrow">{data?.eyebrow ?? 'BEFORE AND AFTERS'}</p>
        <h2 className="reviews2__title">
          <span className="c">{data?.heading?.accent ?? 'Real moves.'}</span>{' '}
          {data?.heading?.rest ?? 'Signed.'}
        </h2>
        <p className="reviews2__sub">
          {data?.subtext ??
            'Every case unretouched, originals on file, signed by the dentist responsible.'}
        </p>
      </div>

      <div
        className="reviews2__row"
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
          <article className="r2card" key={`${c.name}-${i}`}>
            <div className="r2card__imgs">
              <figure className="r2card__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.before} alt={`${c.name} before treatment`} draggable={false} />
                <span className="r2card__tag">Before</span>
              </figure>
              <figure className="r2card__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.after} alt={`${c.name} after treatment`} draggable={false} />
                <span className="r2card__tag">After</span>
              </figure>
            </div>
            <div className="r2card__body">
              <p className="r2card__name">{c.name}</p>
              <blockquote className="r2card__quote">“{c.quote}”</blockquote>
              <p className="r2card__signed">{c.signedBy}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="reviews2__dots" role="tablist" aria-label="Slider pages">
        {Array.from({ length: DOTS }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`reviews2__dot${i === active ? ' is-active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === active}
            onClick={() => goToDot(i)}
          />
        ))}
      </div>
    </section>
  );
}
