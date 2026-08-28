'use client';

import './footer-v2.css';

import { useState } from 'react';
import { ArrowUpRight, Envelope } from './icons';
import { mediaUrl, mediaAlt } from '@/lib/media';

/* Footer link column — a static column on desktop, a tap-to-expand accordion on
   mobile (Figma). Desktop CSS force-shows the list regardless of `is-open`. */
function FooterCol({ title, links }: { title: string; links: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`footer__col${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="footer__col-title"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <svg
          className="footer__col-chevron"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <ul className="footer__col-list">
        {links.map((l) => (
          <li key={l}>
            <a href="#">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface FooterData {
  navLinks?: { label?: string; href?: string }[];
  socialLinks?: { platform?: string; href?: string }[];
  mailingLabel?: string;
  emailPlaceholder?: string;
  wordmark?: unknown;
  copyright?: string;
}

const FALLBACK_LINKS = [
  { label: 'Shop', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Science', href: '#' },
  { label: 'FAQs', href: '#' },
  { label: 'Contact', href: '#' },
];

const FALLBACK_SOCIALS = [
  { platform: 'instagram', href: '#' },
  { platform: 'tiktok', href: '#' },
  { platform: 'email', href: '#' },
];

/* ---- 2.0 footer (Figma): red band, logo + 3 link columns + social ---- */
const F2_COLUMNS: { title: string; links: string[] }[] = [
  {
    title: 'Move',
    links: ['About us', 'Contact us', 'How it’s work', 'Result', 'For Dentists', 'Pricing', 'Faq', 'Clinics'],
  },
  { title: 'Treatments', links: ['Clear aligners', 'Composite Bonding'] },
  { title: 'Support', links: ['Terms & Conditions', 'Privacy Policy', 'Refund Policy'] },
];

const F2_SOCIALS = [
  { name: 'Facebook', icon: '/images/social-facebook.svg' },
  { name: 'TikTok', icon: '/images/social-tiktok-circle.svg' },
];

export function Footer({ data, variant }: { data?: FooterData; variant?: 'v2' }) {
  const navLinks = data?.navLinks?.length ? data.navLinks : FALLBACK_LINKS;
  const socialLinks = data?.socialLinks?.length ? data.socialLinks : FALLBACK_SOCIALS;

  if (variant === 'v2') {
    return (
      <footer className="footer footer--v2">
        <div className="footer__inner">
          <div className="footer__top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="footer__logo" src="/images/moves-logo.svg" alt="Moves" />
            <div className="footer__cols">
              {F2_COLUMNS.map((col) => (
                <FooterCol key={col.title} title={col.title} links={col.links} />
              ))}
            </div>
          </div>

          <hr className="footer__divider" />

          <div className="footer__bottom">
            <p className="footer__copy">{data?.copyright ?? '© Copyright 2026 Moves'}</p>
            <div className="footer__social-2">
              <span className="footer__social-label">Check our Social Media</span>
              <div className="footer__social-icons">
                {F2_SOCIALS.map((s) => (
                  <a key={s.name} href="#" aria-label={s.name} className="footer__social-pill">
                    <span className="footer__social-name">{s.name}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="footer__social-badge" src={s.icon} alt="" width={22} height={22} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__left">
            <div className="footer__nav">
              {navLinks.map((l, i) => (
                <a key={i} href={l.href ?? '#'}>
                  {l.label}
                </a>
              ))}
            </div>
            <div className="footer__social">
              {socialLinks.map((s, i) => {
                const href = s.href ?? '#';
                if (s.platform === 'instagram') {
                  return (
                    <a key={i} href={href} aria-label="Instagram">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/social-instagram.svg" alt="" width={27} height={27} />
                    </a>
                  );
                }
                if (s.platform === 'tiktok') {
                  return (
                    <a key={i} href={href} aria-label="TikTok">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/social-tiktok.svg" alt="" width={27} height={27} />
                    </a>
                  );
                }
                if (s.platform === 'email') {
                  return (
                    <a key={i} href={href} aria-label="Email">
                      <Envelope />
                    </a>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <div className="footer__mail">
            <span className="footer__mail-label">{data?.mailingLabel ?? 'join our mailing list'}</span>
            <div className="footer__input">
              <span>{data?.emailPlaceholder ?? 'YOUR EMAIL'}</span>
              <button type="button" className="footer__submit" aria-label="Subscribe">
                <ArrowUpRight />
              </button>
            </div>
          </div>
        </div>

        <div className="footer__wordmark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(data?.wordmark, '/images/moves-wordmark.svg')}
            alt={mediaAlt(data?.wordmark, 'Moves')}
          />
          <p className="footer__copy">{data?.copyright ?? '© Copyright 2026 Moves'}</p>
        </div>
      </div>
    </footer>
  );
}
