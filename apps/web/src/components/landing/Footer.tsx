import { ArrowUpRight, Envelope } from './icons';
import { mediaUrl, mediaAlt } from '@/lib/media';

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

export function Footer({ data }: { data?: FooterData }) {
  const navLinks = data?.navLinks?.length ? data.navLinks : FALLBACK_LINKS;
  const socialLinks = data?.socialLinks?.length ? data.socialLinks : FALLBACK_SOCIALS;

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
