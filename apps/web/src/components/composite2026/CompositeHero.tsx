import { BOOKING_PATH } from '@/lib/booking/links';

/* Composite Bonding hero (Figma 984:7285) — reuses the clear-aligners navy hero
   card (`.ca-hero`, scoped to `.ca26`): Trustpilot chip, headline (coral "Always
   Wanted"), lead, coral CTA + text link, and a signed "Amelia Hart" chip on the
   left; portrait on the navy dome on the right. */
export function CompositeHero() {
  return (
    <section className="ca-hero">
      <div className="ca-hero__inner">
        <div className="ca-hero__col">
          <div className="ca-hero__trust">
            <span className="ca-hero__trust-label">Excellent</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ca-hero__stars" src="/images/trustpilot-rating.svg" alt="Rated 4.5 out of 5" />
            <span className="ca-hero__trust-count">100+ review on</span>
            <span className="ca-hero__trust-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ca-hero__trust-star" src="/images/trustpilot-star.svg" alt="" aria-hidden="true" />
              Trustpilot
            </span>
          </div>

          <h1 className="ca-hero__title">
            The Smile You&rsquo;ve <span className="ca-hero__accent">Always Wanted</span>
          </h1>
          <p className="ca-hero__lead">
            GLIDE is the leading force for contemporary aesthetics. Expertly planned by our premier
            GDC-registered clinical team, at a transparent and published cost. The outcome is yours, a
            precision movement that ensures you feel supported.
          </p>

          <div className="ca-hero__actions">
            <a className="btn lp26-btn ca-hero__cta" href={BOOKING_PATH}>
              Book Free Consultation
            </a>
            <a className="ca-hero__link" href="#pricing">
              See exactly what it costs
            </a>
          </div>

          <div className="ca-hero__sign">
            <span className="ca-hero__sign-name">Amelia Hart</span>
            <span className="ca-hero__sign-div" aria-hidden="true" />
            <span className="ca-hero__sign-meta">
              <span className="ca-hero__sign-line">SIGNED · GDC No. 123456</span>
              <span className="ca-hero__sign-line">ON THE PLAN. IN YOUR ACCOUNT. ON THE BOX.</span>
            </span>
          </div>
        </div>

        <div className="ca-hero__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ca-hero__dome" src="/images/ca-hero-dome.png" alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ca-hero__portrait"
            src="/images/composite-hero-portrait.png"
            alt="A person smiling after composite bonding treatment"
          />
        </div>
      </div>
    </section>
  );
}
