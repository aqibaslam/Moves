import { BOOKING_PATH } from '@/lib/booking/links';

/* Results hero (Figma 984:13522 desktop / 984:14006 mobile) — same rounded navy
   card as the clear-aligners hero: Trustpilot chip, headline (coral "look
   like."), lead, a coral CTA + text link, and the portrait on a navy dome. */
export function ResultsHero() {
  return (
    <section className="ca-hero rh-hero">
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
            See what a moves smile can <span className="ca-hero__accent">look like.</span>
          </h1>
          <p className="ca-hero__lead">
            Every smile here started with an in-person scan, a dentist-signed plan, and a clear
            aligner journey built around real movement. Browse results by concern, package, and
            treatment time.
          </p>

          <div className="ca-hero__actions">
            <a className="btn lp26-btn ca-hero__cta" href={BOOKING_PATH}>
              Book Free Consultation
            </a>
            <a className="ca-hero__link" href="#pricing">
              See exactly what it costs
            </a>
          </div>
        </div>

        <div className="ca-hero__media">
          {/* soft blue glow behind the portrait (Figma Ellipse 1356) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ca-hero__dome" src="/images/results-hero-glow.png" alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ca-hero__portrait"
            src="/images/results-hero-portrait.png"
            alt="A person with a MOVES smile"
          />
        </div>
      </div>
    </section>
  );
}
