'use client';

import './footer-dark.css';

import { useState } from 'react';

/* Dark 2026 footer (Figma node 413:10170): navy band, white wordmark, a
   newsletter capture on the left and three link columns on the right, with
   copyright + social pills below a divider. Distinct from the landing's
   pale-tint v2 footer. */

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: 'Move',
    links: ['About us', 'Contact us', 'How it’s work', 'Result', 'For Dentists', 'Pricing', 'Faq', 'Clinics'],
  },
  { title: 'Treatments', links: ['Clear aligners', 'Composite Bonding'] },
  { title: 'Support', links: ['Terms & Conditions', 'Privacy Policy', 'Refund Policy'] },
];

const SOCIALS = [
  { name: 'Facebook', icon: '/images/social-facebook.svg' },
  { name: 'Instagram', icon: '/images/social-instagram.svg' },
];

function Col({ title, links }: { title: string; links: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`lp26-foot__col${open ? ' is-open' : ''}`}>
      <button type="button" className="lp26-foot__col-title" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {title}
        <svg className="lp26-foot__chevron" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ul className="lp26-foot__col-list">
        {links.map((l) => (
          <li key={l}>
            <a href="#">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterDark() {
  return (
    <footer className="lp26-foot">
      <div className="lp26-foot__inner">
        <div className="lp26-foot__top">
          <div className="lp26-foot__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lp26-foot__logo" src="/images/f26-foot-logo.svg" alt="Moves" />
            <p className="lp26-foot__pitch">
              Enter your email for clear aligner tips, treatment guidance, and the latest from MOVES.
            </p>
            <form className="lp26-foot__signup" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" aria-label="Email address" />
              <button type="submit" className="btn lp26-btn">
                Submit
              </button>
            </form>
          </div>

          <div className="lp26-foot__cols">
            {COLUMNS.map((c) => (
              <Col key={c.title} title={c.title} links={c.links} />
            ))}
          </div>
        </div>

        <hr className="lp26-foot__divider" />

        <div className="lp26-foot__bottom">
          <p className="lp26-foot__copy">&copy; Copyright 2026 Moves</p>
          <div className="lp26-foot__social">
            <span className="lp26-foot__social-label">Check our Social Media</span>
            <div className="lp26-foot__social-icons">
              {SOCIALS.map((s) => (
                <a key={s.name} href="#" aria-label={s.name} className="lp26-foot__pill">
                  <span>{s.name}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.icon} alt="" width={22} height={22} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
