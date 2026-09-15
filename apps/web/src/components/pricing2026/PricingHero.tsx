import { BOOKING_PATH } from '@/lib/booking/links';

/* Pricing hero (Figma 984:10950) — same navy card as the clear-aligners hero,
   but the Trustpilot chip is replaced by a 4-item feature checklist. Headline
   "Exactly what moves costs." (coral), lead, coral CTA + text link, the signed
   Amelia Hart chip, and the portrait on a navy dome. Reuses `.ca-hero` styling
   (scoped to `.ca26`) plus a few `.pricing26` additions. */

const FEATURES = [
  'Prices published upfront',
  'Packages from £895',
  'Monthly plans available',
  'Dentist-led treatment included',
];

function CheckDisc() {
  return (
    <span className="ph-hero__check" aria-hidden="true">
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
        <circle cx="10" cy="10" r="10" fill="currentColor" />
        <path d="m6 10.3 2.6 2.6L14 7.5" stroke="#091620" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function PricingHero() {
  return (
    <section className="ca-hero ph-hero">
      <div className="ca-hero__inner">
        <div className="ca-hero__col">
          <h1 className="ca-hero__title">
            Exactly what
            <br />
            <span className="ca-hero__accent">moves costs.</span>
          </h1>
          <p className="ca-hero__lead">
            Some aligner brands make you book a call before you see the price. We publish ours
            clearly — so you can understand the cost before your consultation.
          </p>

          <ul className="ph-hero__features">
            {FEATURES.map((f) => (
              <li className="ph-hero__feature" key={f}>
                <CheckDisc />
                {f}
              </li>
            ))}
          </ul>

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
            src="/images/pricing-hero-portrait.png"
            alt="A person holding a clear aligner"
          />
        </div>
      </div>
    </section>
  );
}
