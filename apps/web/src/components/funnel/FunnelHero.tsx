import { StarChip, TrustpilotStar, Check } from '@/components/landing/icons';

const FEATURES = [
  'Every treatment plan signed by a named, GDC-registered dentist',
  'Progress checked at every tray change',
  'Every price published below, from £895',
  '30-day money-back guarantee',
];

export function FunnelHero() {
  return (
    <div className="hero-unit">
      {/* Announcement bar */}
      <div className="f-announce">
        Every MOVES® smile is signed by a named, GDC-registered dentist.
      </div>

      {/* Minimal nav: logo left, "save" text right (no links, no button) */}
      <nav className="f-nav" aria-label="Primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="f-nav__logo"
          src="/images/moves-logo.svg"
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
              <span className="rating__count">Excellent (3,890)</span>
              <div className="rating__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarChip key={i} />
                ))}
              </div>
              <div className="rating__tp">
                <TrustpilotStar />
                <span>Trustpilot</span>
              </div>
            </div>

            <h1 className="h-hero">
              <span className="c">The smile</span>{' '}you&rsquo;ve been putting off
            </h1>

            <p className="hero__sub">
              Clear aligners planned in person and signed by a named, GDC-registered dentist. Prices
              published below.
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
            <a className="btn btn--navy" href="#cta" style={{ width: 254 }}>
              Book Free Consultation
            </a>
            <p className="hero-cap">
              Free, online, no pressure. If aligners aren&rsquo;t right for you, we&rsquo;ll say so.
            </p>
          </div>
        </div>

        <div className="hero__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-portrait.png" alt="A person smiling confidently" />
        </div>
      </section>
    </div>
  );
}
