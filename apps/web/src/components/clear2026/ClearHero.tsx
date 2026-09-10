import { BOOKING_PATH } from '@/lib/booking/links';

/* Clear-aligners hero (Figma 413:16797) — a rounded navy card: Trustpilot chip,
   headline (coral "putting off"), lead, a coral CTA + text link, and a signed
   "Amelia Hart" chip on the left; portrait on a navy dome on the right. */
export function ClearHero() {
  return (
    <section className="ca-hero">
      <div className="ca-hero__inner">
        <div className="ca-hero__col">
          <div className="ca-hero__trust">
            <span className="ca-hero__trust-label">Excellent</span>
            <span className="ca-hero__stars" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <span className="ca-hero__star" key={i}>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="#fff" aria-hidden="true">
                    <path d="m12 2 2.9 6.2 6.8.7-5 4.6 1.4 6.7L12 17.7 5.9 21l1.4-6.7-5-4.6 6.8-.7L12 2Z" />
                  </svg>
                </span>
              ))}
            </span>
            <span className="ca-hero__trust-count">100+ review on</span>
            <span className="ca-hero__trust-logo">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="#00b67a" aria-hidden="true">
                <path d="m12 2 2.9 6.2 6.8.7-5 4.6 1.4 6.7L12 17.7 5.9 21l1.4-6.7-5-4.6 6.8-.7L12 2Z" />
              </svg>
              Trustpilot
            </span>
          </div>

          <h1 className="ca-hero__title">
            The smile you’ve been <span className="ca-hero__accent">putting off</span>
          </h1>
          <p className="ca-hero__lead">
            MOVES is the movement behind modern smiles. Planned in person, signed by a named
            GDC-registered dentist, at a price we publish. The smile is yours, the signature means
            you never move alone.
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
            src="/images/ca-hero-portrait.png"
            alt="A person holding a clear aligner"
          />
        </div>
      </div>
    </section>
  );
}
