'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { BOOKING_PATH } from '@/lib/booking/links';
import { CTA_LABEL, NAV_LINKS } from './content';

/* Mobile navigation: a full-height Milk panel under the sticky bar. Escape
   closes it, focus moves into it on open and back to the toggle on close,
   and the page behind stops scrolling while it's open. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    document.documentElement.classList.add('mv-lock');
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('mv-lock');
      document.removeEventListener('keydown', onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="mv-menu-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <span className="mv-menu-toggle__bars" aria-hidden="true" />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        className="mv-menu"
        data-open={open}
        hidden={!open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) setOpen(false);
        }}
      >
        <nav aria-label="Mobile">
          <ul className="mv-menu__links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="mv-btn mv-btn--pulse mv-btn--block" href={BOOKING_PATH}>
          {CTA_LABEL}
        </a>
        <p className="mv-menu__note">
          Every MOVES plan is signed by a named, GDC-registered dentist.
        </p>
      </div>
    </>
  );
}
