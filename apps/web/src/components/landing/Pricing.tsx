import { Check } from './icons';

const FEATURES = ['Dual Arch', '4—6 months treatment time', 'Crowding on 6-8 teeth', 'Bite correction'];

function PlanCard({
  title,
  pink = false,
  btnClass,
  alt,
}: {
  title: string;
  pink?: boolean;
  btnClass: string;
  alt: string;
}) {
  return (
    <div className={`pcard${pink ? ' pcard--pink' : ''}`}>
      <div className="pcard__head">
        <div className="pcard__info">
          <h3 className="pcard__title">{title}</h3>
          <div className="pcard__pricing">
            <p className="pcard__from">From</p>
            <div className="pcard__price">
              <b>£16.30</b>
              <span>/per month</span>
            </div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pcard__product" src="/images/pricing-product.png" alt={alt} />
      </div>

      <hr className="pcard__div" />

      <div className="pcard__feats">
        {FEATURES.map((f) => (
          <span className="feat" key={f}>
            <Check />
            {f}
          </span>
        ))}
      </div>

      <a className={`btn ${btnClass}`} href="#cta">
        Book Free Consultation
      </a>
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
          <PlanCard title="Clear aligners" pink btnClass="btn--coral" alt="Clear aligner" />
          <PlanCard title="Composite Bonding" btnClass="btn--navy" alt="Composite bonding" />
        </div>
      </div>
    </section>
  );
}
