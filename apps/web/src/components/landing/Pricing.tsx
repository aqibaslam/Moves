import { Check } from './icons';

const FEATURES = ['Dual Arch', '4—6 months treatment time', 'Crowding on 6-8 teeth', 'Bite correction'];

function Features() {
  return (
    <div className="pcard__feats">
      {FEATURES.map((f) => (
        <span className="feat" key={f}>
          <Check />
          {f}
        </span>
      ))}
    </div>
  );
}

export function Pricing() {
  return (
    <section className="card-section pricing" id="pricing">
      <div className="pricing__inner">
        <div className="pricing__head">
          <p className="eyebrow">PRICING</p>
          <h2 className="h-section">
            <span className="c">Exactly what</span> Moves costs
          </h2>
          <p className="lead">
            Some brands make you book a call to learn a price. Ours are published. Every package, in
            full, before you&rsquo;ve given us so much as an email address. That&rsquo;s it.
            That&rsquo;s the section.
          </p>
        </div>

        <div className="pricing__cards">
          <div className="pcard pcard--pink">
            <h3 className="pcard__title">Clear aligners</h3>
            <p className="pcard__from">From</p>
            <div className="pcard__price">
              <b>£16.30</b>
              <span>/per month</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pcard__product" src="/images/pricing-product.png" alt="Clear aligner" />
            <hr className="pcard__div" />
            <Features />
            <a className="btn btn--coral" href="#cta">
              Book Free Consultation
            </a>
          </div>

          <div className="pcard">
            <h3 className="pcard__title">Composite Bonding</h3>
            <p className="pcard__from">From</p>
            <div className="pcard__price">
              <b>£16.30</b>
              <span>/per month</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pcard__product" src="/images/pricing-product.png" alt="Composite bonding" />
            <hr className="pcard__div" />
            <Features />
            <a className="btn btn--navy" href="#cta">
              Book Free Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
