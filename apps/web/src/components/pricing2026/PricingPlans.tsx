import { BOOKING_PATH } from '@/lib/booking/links';

/* "Choose the level of movement your smile needs" (Figma 984:11200) — four
   pricing cards (Mild · Moderate · Composite Bonding · Transform). The cards
   share the same content in Figma apart from the title. */

const PLANS = ['Mild', 'Moderate', 'Composite Bonding', 'Transform'];

function Tick() {
  return (
    <svg className="ph-plan__tick" viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
      <path d="m4 10.5 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PricingPlans() {
  return (
    <section className="card-section ph-plans" id="pricing">
      <div className="ph-plans__head">
        <h2 className="h-section ph-plans__title">
          Choose the level of movement your <span className="c">smile needs</span>
        </h2>
        <p className="ph-plans__sub">
          Some brands make you book a call to learn a price. Ours are published. Every package, in
          full, before you’ve given us so much as an email address. That’s it. That’s the section.
        </p>
      </div>

      <div className="ph-plans__grid">
        {PLANS.map((title) => (
          <article className="ph-plan" key={title}>
            <h3 className="ph-plan__name">{title}</h3>
            <p className="ph-plan__price">
              <span className="ph-plan__from">From</span>
              <span className="ph-plan__amount">£16.30</span>
              <span className="ph-plan__per">/per month</span>
            </p>
            <hr className="ph-plan__rule" />

            <p className="ph-plan__label">BEST FOR</p>
            <p className="ph-plan__value">Minor relapse or one small correction</p>

            <p className="ph-plan__label">Treatment range</p>
            <p className="ph-plan__value">Shortest treatment range</p>

            <p className="ph-plan__incl">
              <Tick /> Includes MOVES Care Plan
            </p>

            <a className="btn lp26-btn ph-plan__cta" href={BOOKING_PATH}>
              Book Free Consultation
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
