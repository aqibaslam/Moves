'use client';

import { useState } from 'react';
import { CartBag, MenuIcon } from './icons';
import { mediaAlt, mediaUrl } from '@/lib/media';

export interface HeaderData {
  announcementNote?: string;
  announcementLink?: string;
  announcementMobile?: string;
  logo?: unknown;
  navLinks?: { label?: string; href?: string }[];
  button?: { label?: string; labelMobile?: string; href?: string };
  showCart?: boolean;
}

const FALLBACK_NAV = [
  { label: 'Your Move', href: '#' },
  { label: 'Signed', href: '#' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'In motion', href: '#' },
  { label: 'The movers', href: '#' },
];

export function Header({ data }: { data?: HeaderData }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = data?.navLinks?.length ? data.navLinks : FALLBACK_NAV;
  const noteDesktop =
    data?.announcementNote ?? 'Every MOVES® smile is signed by a named, GDC-registered dentist.';
  const noteMobile = data?.announcementMobile ?? 'SAVE OVER 85% ON YOUR FIRST MONTH';
  const btnLabel = data?.button?.label ?? 'Book A Consultation';
  const btnLabelMobile = data?.button?.labelMobile ?? 'Consultation';
  const btnHref = data?.button?.href ?? '#cta';
  const showCart = data?.showCart ?? true;

  return (
    <>
      <div className="announce">
        {/* desktop message + link */}
        <span className="announce__note announce--desktop">{noteDesktop}</span>
        <a className="announce__link announce--desktop" href="#team">
          {data?.announcementLink ?? 'Meet the dentists who sign →'}
        </a>
        {/* mobile message */}
        <span className="announce__mobile announce--mobile">{noteMobile}</span>
      </div>

      <nav className="nav" aria-label="Primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="nav__logo"
          src={mediaUrl(data?.logo, '/images/moves-logo.svg')}
          alt={mediaAlt(data?.logo, 'Moves')}
          width={163}
          height={20}
        />

        <div className="nav__links">
          {navLinks.map((l, i) => (
            <a key={i} href={l.href ?? '#'}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="nav__actions">
          <a className="btn btn--outline nav__cta" href={btnHref}>
            <span className="nav__cta-full">{btnLabel}</span>
            <span className="nav__cta-short">{btnLabelMobile}</span>
          </a>
          {showCart && (
            <button type="button" className="nav__icon nav__icon--mobile" aria-label="Cart">
              <CartBag />
            </button>
          )}
          <button
            type="button"
            className="nav__icon nav__icon--mobile"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg width="22" height="16" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <MenuIcon />
            )}
          </button>
        </div>
      </nav>

      {/* mobile slide-down menu */}
      <div id="mobile-menu" className={`nav__menu${menuOpen ? ' nav__menu--open' : ''}`}>
        <div className="nav__menu-links">
          {navLinks.map((l, i) => (
            <a key={i} href={l.href ?? '#'} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
        <a className="btn btn--navy nav__menu-cta" href={btnHref} onClick={() => setMenuOpen(false)}>
          {btnLabel}
        </a>
      </div>
    </>
  );
}
