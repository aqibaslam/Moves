import { Check } from '@/components/landing/icons';
import { TrustpilotWidget } from '@/components/landing/TrustpilotWidget';
import { BOOKING_PATH } from '@/lib/booking/links';

const FEATURES = [
  'Every treatment plan signed by a named, GDC-registered dentist',
  'Progress checked at every tray change',
  'Every price published below, from £895',
  '30-day money-back guarantee',
];

export function FunnelHero({ logoSrc = '/images/moves-logo.svg' }: { logoSrc?: string } = {}) {
  return (
    <div className="hero-unit">
      {/* Announcement bar */}
      <div className="f-announce">
        Every MOVES® smile is signed by a GDC-registered dentist.
      </div>

      {/* Minimal nav: logo left, "save" text right (no links, no button) */}
      <nav className="f-nav" aria-label="Primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="f-nav__logo"
          src={logoSrc}
          alt="Moves"
          width={163}
          height={20}
        />
        <span className="f-nav__save">Save over 85% on your first month</span>
      </nav>

      {/* Hero */}
      <section className="hero f-hero" id="main">
        <div className="hero__left">
          <div className="hero__intro">
            <div className="rating">
              <TrustpilotWidget />
            </div>

            <h1 className="h-hero">
              The smile you&rsquo;ve been <span className="c">putting off</span>
            </h1>

            <p className="hero__sub">
              Clear aligners planned in person and signed by a named, GDC-registered dentist. Prices
              published on this page. Aftercare that checks on you before you have to ask.
            </p>
          </div>

          <ul className="hero-feats">
            {FEATURES.map((f) => (
              <li className="hero-feat" key={f}>
                <Check />
                {f}
              </li>
            ))}
          </ul>

          <div className="hero-ctagroup">
            <a className="btn btn--navy" href={BOOKING_PATH} style={{ width: 254 }}>
              Book Free Consultation
            </a>
          </div>
        </div>

        <div className="hero__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero__img hero__img--desktop"
            src="/images/hero-portrait.png"
            alt="A person smiling confidently"
          />
          {/* mobile-only hero image — same as the home page */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero__img hero__img--mobile"
            src="/images/hero-portrait-mobile.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>
    </div>
  );
}
