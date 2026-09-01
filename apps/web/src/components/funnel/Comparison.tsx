'use client';

import { Fragment, useCallback, useEffect, useRef } from 'react';

/* Comparison table (Figma §6). Columns: Feature · MOVES (highlighted) ·
   Invisalign · Traditional braces. Values verbatim from the spec.
   On mobile the table scrolls horizontally and a coral progress thumb
   under it tracks the scroll position (Figma mobile design). */

interface Row {
  label: string;
  moves: string;
  invisalign: string;
  braces: string;
}

const ROWS: Row[] = [
  {
    label: 'Typical total cost',
    moves: '£2,495 all-inclusive (Align, where most people land)',
    invisalign: '£3,500-£5,000¹',
    braces: '£2,000-£4,000²',
  },
  {
    label: 'Treatment time',
    moves: '4-6 months for most cases',
    invisalign: 'Varies; often 6-18 months',
    braces: 'Typically 18-24 months',
  },
  {
    label: 'Visible?',
    moves: 'Virtually invisible',
    invisalign: 'Virtually invisible',
    braces: 'Metal brackets and wires',
  },
  {
    label: 'Eat what you like?',
    moves: 'Yes, trays come out',
    invisalign: 'Yes, trays come out',
    braces: 'Food restrictions',
  },
  {
    label: 'Who signs your plan',
    moves: 'A named, GDC-registered dentist, on the plan',
    invisalign: 'Varies by practice',
    braces: 'Your orthodontist',
  },
  {
    label: "Who's watching between visits",
    moves: 'Care Plan check at every tray change',
    invisalign: 'Varies by practice',
    braces: 'Adjustment visits only',
  },
  {
    label: "If teeth don't match the plan",
    moves: 'Refinements included*',
    invisalign: 'Varies by provider',
    braces: 'Adjusted in-chair',
  },
  {
    label: 'Retainers',
    moves: 'Included, worth £XXX',
    invisalign: 'Usually sold separately',
    braces: 'Usually sold separately',
  },
  {
    label: 'Whitening',
    moves: 'Included, worth £XXX',
    invisalign: 'Not included',
    braces: 'Not included',
  },
];

export function Comparison() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  // Move the coral thumb to reflect how far the table is scrolled.
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
    <section className="card-section f-cmp">
      <div className="f-cmp__head">
        <p className="eyebrow">US VS THEM</p>
        <h2 className="h-section">
          Same straight teeth.{' '}
          <span className="f-cmp__accent">
            <span className="c c--lead">Three very </span>
            <span className="c">different bills.</span>
          </span>
        </h2>
        <p className="lead">
          Most people reading this have either had an Invisalign quote or assumed braces were the
          only affordable option. Here is how the three compare, side by side.
        </p>
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
            Invisalign
          </div>
          <div className="f-cmp__cell f-cmp__cell--head" role="columnheader">
            Fixed braces
          </div>

          {ROWS.map((r) => (
            <Fragment key={r.label}>
              <div className="f-cmp__cell f-cmp__cell--label" role="cell">
                {r.label}
              </div>
              <div className="f-cmp__cell f-cmp__cell--moves" role="cell">
                {r.moves}
              </div>
              <div className="f-cmp__cell f-cmp__cell--val" role="cell">
                {r.invisalign}
              </div>
              <div className="f-cmp__cell f-cmp__cell--val" role="cell">
                {r.braces}
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
