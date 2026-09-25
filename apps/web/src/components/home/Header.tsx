import { BOOKING_PATH } from '@/lib/booking/links';
import { MobileMenu } from './MobileMenu';
import { ArrowRight } from './icons';
import { CTA_LABEL, CTA_LABEL_SHORT, NAV_LINKS } from './content';

/* Navigation: aligned to the hero panel's edges. The official logo, five
   destinations, one action. */
export function Header() {
  return (
    <>
      <header className="mv-nav">
        <div className="mv-nav__bar">
          <a className="mv-nav__logo" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/moves-logo-ink.svg" alt="MOVES home" width={124} height={28} />
          </a>

          <nav className="mv-nav__links" aria-label="Primary">
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mv-nav__actions">
            <a className="mv-btn mv-btn--pulse mv-btn--nav" href={BOOKING_PATH}>
              <span className="mv-nav__cta-full">{CTA_LABEL}</span>
              <span className="mv-nav__cta-short">{CTA_LABEL_SHORT}</span>
              <ArrowRight />
            </a>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
