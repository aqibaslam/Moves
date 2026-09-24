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
  // render the set THREE times so scrolling loops seamlessly in BOTH directions:
  // the user rides the middle copy, with an identical copy on each side to slide
  // into. When they drift into a side copy we jump back by one set-width — the
  // copies are identical, so the loop is invisible.
  const loop = [...cards, ...cards, ...cards];

  // width of one card + gap — the amount to move per step
  const cardStep = () => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>('.bacard');
    return card ? card.offsetWidth + 4 : 0;
  };
  const setWidth = () => cardStep() * DOTS;

  // Keep the scroll position inside the MIDDLE copy so there's always a full set
  // to scroll into on either side (this is what makes manual scrolling loop
  // forever, not just twice). Skipped mid-drag — the drag owns scrollLeft then.
  const recenter = () => {
    const el = trackRef.current;
    if (!el || el.classList.contains('dragging')) return;
    const w = setWidth();
    if (w <= 0) return;
    let delta = 0;
    if (el.scrollLeft < w * 0.5) delta = w;
    else if (el.scrollLeft > w * 2.5) delta = -w;
    if (!delta) return;
    // The jump MUST be instant — the CSS `scroll-behavior: smooth` animates
    // (and snap reverts) a scrollLeft change, so the wrap silently fails.
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft += delta;
    el.style.scrollBehavior = prev;
  };

  const syncActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.bacard');
    const step = card ? card.offsetWidth + 4 : 0;
    const idx = step > 0 ? Math.round(el.scrollLeft / step) : 0;
    setActive(((idx % DOTS) + DOTS) % DOTS);
  }, [DOTS]);

  // Recenter only AFTER scrolling settles — jumping mid-scroll fights the
  // browser's snap/momentum. `syncActive` (dots) can update live.
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onScroll = useCallback(() => {
    syncActive();
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => recenter(), 140);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncActive]);

  const goToDot = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    // scroll to card i within the middle copy
    el.scrollTo({ left: setWidth() + i * cardStep(), behavior: 'smooth' });
  };

  // Start in the middle copy once the cards have a measurable width.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const init = () => {
      const w = setWidth();
      if (w > 0) {
        const prev = el.style.scrollBehavior;
        el.style.scrollBehavior = 'auto';
        el.scrollLeft = w; // start in the middle copy (instant; smooth reverts it)
        el.style.scrollBehavior = prev;
      } else {
        raf = requestAnimationFrame(init);
      }
    };
    init();
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onScroll]);

  // Auto-play: advance one card at a time; the recenter loop above keeps it
  // seamless. Pauses while the user interacts (hover / drag) and for
  // reduced-motion users.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      recenter();
      el.scrollBy({ left: cardStep(), behavior: 'smooth' });
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  // drag-to-scroll (refs so dragging doesn't re-render on every move)
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });
  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    setPaused(true);
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
    el.classList.add('dragging');
    // Capture the pointer so we still get move/up even if the cursor leaves the
    // slider mid-drag. Without this, a drag that ends outside never fires
    // pointerup → `down` stays true and every later mouse move hijacks the
    // scroll, so the slider only "works once".
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* not all pointers are capturable */
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    // if the button was released off-element (no capture), stop dragging
    if (e.buttons === 0) {
      endDrag(e);
      return;
    }
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = (e?: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    if (!drag.current.down) return;
    drag.current.down = false;
    el.classList.remove('dragging');
    if (e) {
      try {
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <section className="card-section ba">
      <div className="ba__head">
        <p className="eyebrow">{data?.eyebrow ?? 'BEFORE AND AFTERS'}</p>
        <h2 className="h-section">
          <span className="c">{data?.heading?.accent ?? 'Real moves.'}</span>{' '}
          <span className="ba__rest">{data?.heading?.rest ?? 'Signed.'}</span>
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
