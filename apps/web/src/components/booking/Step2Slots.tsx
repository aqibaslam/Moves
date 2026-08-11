'use client';

import { useEffect, useState } from 'react';

import type { AvailabilityDay, SlotTime } from '@/lib/booking/types';

export function Step2Slots({
  status,
  days,
  selected,
  onSelect,
  onBack,
  onNext,
  onRetry,
}: {
  status: 'loading' | 'error' | 'ready';
  days: AvailabilityDay[];
  selected: SlotTime | null;
  onSelect: (slot: SlotTime) => void;
  onBack: () => void;
  onNext: () => void;
  onRetry: () => void;
}) {
  const [activeDate, setActiveDate] = useState<string | null>(null);

  // Slots usually arrive after this component mounts (loading → ready), so the
  // initial useState value can't see them. Select the first bookable day once
  // they load, or if the current selection falls out of the returned window.
  useEffect(() => {
    if (days.length === 0) return;
    if (activeDate && days.some((d) => d.date === activeDate)) return;
    setActiveDate(days.find((d) => d.times.length > 0)?.date ?? days[0].date);
  }, [days, activeDate]);

  const active = days.find((d) => d.date === activeDate) ?? null;

  if (status === 'loading') {
    return (
      <div className="bk-slots">
        <div className="bk-daystrip" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <span className="bk-day bk-skel" key={i} />
          ))}
        </div>
        <div className="bk-timegrid" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span className="bk-time bk-skel" key={i} />
          ))}
        </div>
        <p className="bk-status" role="status">
          Loading available times…
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bk-empty" role="alert">
        <p>We couldn’t load available times.</p>
        <button className="btn btn--navy" type="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="bk-empty">
        <p>No slots are available right now. Please check back shortly.</p>
        <button className="bk-back" type="button" onClick={onBack}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="bk-slots">
      <div className="bk-daystrip" role="tablist" aria-label="Choose a day">
        {days.map((d) => {
          const isActive = d.date === activeDate;
          const isEmpty = d.times.length === 0;
          return (
            <button
              key={d.date}
              role="tab"
              type="button"
              aria-selected={isActive}
              className={`bk-day${isActive ? ' is-active' : ''}${isEmpty ? ' is-empty' : ''}`}
              disabled={isEmpty}
              onClick={() => setActiveDate(d.date)}
            >
              <span className="bk-day__wd">{d.weekdayLabel}</span>
              <span className="bk-day__dt">{d.dayLabel}</span>
            </button>
          );
        })}
      </div>

      {active && active.times.length > 0 ? (
        <div className="bk-timegrid" role="listbox" aria-label={`Times on ${active.dayLabel}`}>
          {active.times.map((t) => {
            const isSel = selected?.startISO === t.startISO;
            return (
              <button
                key={t.startISO}
                type="button"
                role="option"
                aria-selected={isSel}
                className={`bk-time${isSel ? ' is-selected' : ''}`}
                onClick={() => onSelect(t)}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="bk-status">No times left on this day — pick another.</p>
      )}

      <div className="bk-actions">
        <button className="bk-back" type="button" onClick={onBack}>
          ← Back
        </button>
        <button className="btn btn--navy" type="button" disabled={!selected} onClick={onNext}>
          Review booking
        </button>
      </div>
    </div>
  );
}
