'use client';

import { Fragment, useCallback, useEffect, useRef } from 'react';

/* "See how move compares" (Figma 413:17435). Reuses the funnel `.f-cmp` table
   markup/CSS — so the desktop grid and the mobile horizontal-scroll "slides"
   with a coral progress thumb come for free — but with the clear-aligners data:
   columns MOVES · Mail-Order Aligners · Traditional Braces, cells are either a
   tick or a short value. */

type Cell = string | true; // true = checkmark
interface Row {
  label: string;
  moves: Cell;
  mail: Cell;
  braces: Cell;
}

const CHECK = true as const;
const ROWS: Row[] = [
  { label: 'Start with an in-person scan', moves: CHECK, mail: CHECK, braces: CHECK },
  { label: 'Named dentist throughout treatment', moves: CHECK, mail: CHECK, braces: CHECK },
  {
    label: 'Typical frequency of treatment check-ins',
    moves: 'Every tray change, often virtually',
    mail: 'Less frequent, often app',
    braces: 'Every 4–8 weeks, in person',
  },
  { label: 'Removable for meals', moves: CHECK, mail: CHECK, braces: CHECK },
  {
    label: 'Your progress is reviewed by your dentist at every aligner tray change',
    moves: CHECK,
    mail: CHECK,
    braces: CHECK,
  },
  { label: 'Designed to minimize visible attachments', moves: CHECK, mail: 'Varies', braces: 'Varies' },
];

function Tick() {
  return (
    <svg className="f-cmp__tick" viewBox="0 0 20 20" width="18" height="18" fill="none" aria-label="Yes">
      <path d="m4 10.5 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function cell(v: Cell) {
  return v === true ? <Tick /> : v;
}

export function ClearComparison() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const syncProgress = useCallback(() => {
    const el = wrapRef.current;
    const fill = fillRef.current;
    if (!el || !fill) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    const thumb = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
    fill.style.width = `${thumb * 100}%`;
    fill.style.left = `${ratio * (1 - thumb) * 100}%`;
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    syncProgress();
    el.addEventListener('scroll', syncProgress, { passive: true });
    window.addEventListener('resize', syncProgress);
    return () => {
      el.removeEventListener('scroll', syncProgress);
      window.removeEventListener('resize', syncProgress);
    };
  }, [syncProgress]);

  return (
    <section className="card-section f-cmp ca-cmp">
      <div className="f-cmp__head">
        <h2 className="h-section">
          See how move <span className="c">compares</span>
        </h2>
      </div>

      <div className="f-cmp__wrap" ref={wrapRef}>
        <div className="f-cmp__table" role="table" aria-label="How Moves compares">
          {/* header row */}
          <div className="f-cmp__cell f-cmp__cell--head f-cmp__cell--label" role="columnheader" />
          <div className="f-cmp__cell f-cmp__cell--head f-cmp__cell--moves" role="columnheader">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/moves-logo.svg" alt="Moves" />
          </div>
          <div className="f-cmp__cell f-cmp__cell--head" role="columnheader">
            Mail-Order Aligners
          </div>
          <div className="f-cmp__cell f-cmp__cell--head" role="columnheader">
            Traditional Braces
          </div>

          {ROWS.map((r) => (
            <Fragment key={r.label}>
              <div className="f-cmp__cell f-cmp__cell--label" role="cell">
                {r.label}
              </div>
              <div className="f-cmp__cell f-cmp__cell--moves" role="cell">
                {cell(r.moves)}
              </div>
              <div className="f-cmp__cell f-cmp__cell--val" role="cell">
                {cell(r.mail)}
              </div>
              <div className="f-cmp__cell f-cmp__cell--val" role="cell">
                {cell(r.braces)}
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      {/* mobile-only scroll progress thumb (hidden on desktop where the table fits) */}
      <div className="f-cmp__scroll" aria-hidden="true">
        <span className="f-cmp__scroll-fill" ref={fillRef} />
      </div>
    </section>
  );
}
