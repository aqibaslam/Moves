import { Check } from './icons';
import { mediaUrl, mediaAlt } from '@/lib/media';

export interface PricingData {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  subtext?: string;
  plans?: {
    title?: string;
    price?: string;
    per?: string;
    productImage?: unknown;
    features?: { text?: string }[];
    buttonLabel?: string;
    variant?: string;
  }[];
}

const FEATURES = ['Dual Arch', '4—6 months treatment time', 'Crowding on 6-8 teeth', 'Bite correction'];

interface Plan {
  title: string;
  price: string;
  per: string;
  productImage: string;
  imageAlt: string;
  features: string[];
  buttonLabel: string;
  buttonHref: string;
  variant: string;
}

function PlanCard({ plan }: { plan: Plan }) {
  const pink = plan.variant === 'pink';
  const btnClass = pink ? 'btn--coral' : 'btn--navy';
  return (
    <div className={`pcard${pink ? ' pcard--pink' : ''}`}>
      <div className="pcard__head">
        <div className="pcard__info">
          <h3 className="pcard__title">{plan.title}</h3>
          <div className="pcard__pricing">
            <p className="pcard__from">From</p>
            <div className="pcard__price">
              <b>{plan.price}</b>
              <span>{plan.per}</span>
            </div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pcard__product" src="/images/pricing-aligner.png" alt={plan.imageAlt} />
      </div>

      <hr className="pcard__div" />

      <div className="pcard__feats">
        {plan.features.map((f, i) => (
          <span className="feat" key={i}>
            <Check />
            {f}
          </span>
        ))}
      </div>

      <a className={`btn ${btnClass}`} href={plan.buttonHref}>
        {plan.buttonLabel}
      </a>
    </div>
  );
}

const FALLBACK_PLANS: Plan[] = [
  {
    title: 'Clear aligners',
    price: '£16.30',
    per: '/per month',
    productImage: '/images/pricing-product.png',
    imageAlt: 'Clear aligner',
    features: FEATURES,
    buttonLabel: 'Book Free Consultation',
    buttonHref: '#cta',
    variant: 'pink',
  },
  {
    title: 'Composite Bonding',
    price: '£16.30',
    per: '/per month',
    productImage: '/images/pricing-product.png',
    imageAlt: 'Composite bonding',
    features: FEATURES,
    buttonLabel: 'Book Free Consultation',
    buttonHref: '#cta',
    variant: 'navy',
  },
];

export function Pricing({ data }: { data?: PricingData }) {
  const plans: Plan[] = data?.plans?.length
    ? data.plans.map((p) => ({
        title: p.title ?? '',
        price: p.price ?? '£16.30',
        per: p.per ?? '/per month',
        productImage: mediaUrl(p.productImage, '/images/pricing-product.png'),
        imageAlt: mediaAlt(p.productImage, p.title ?? ''),
        features: p.features?.length ? p.features.map((f) => f.text ?? '') : FEATURES,
        buttonLabel: p.buttonLabel ?? 'Book Free Consultation',
        buttonHref: '#cta',
        variant: p.variant ?? 'navy',
      }))
    : FALLBACK_PLANS;

  return (
    <section className="card-section pricing" id="pricing">
      <div className="pricing__inner">
        <div className="pricing__head">
          <p className="eyebrow">{data?.eyebrow ?? 'PRICING'}</p>
          <h2 className="h-section">
            <span className="c">{data?.heading?.accent ?? 'Exactly what'}</span>{' '}
            {data?.heading?.rest ?? 'Moves costs'}
          </h2>
          <p className="lead">
            {data?.subtext ??
              'Some brands make you book a call to learn a price. Ours are published. Every package, in full, before you’ve given us so much as an email address. That’s it. That’s the section.'}
          </p>
        </div>

        <div className="pricing__cards">
          {plans.map((plan, i) => (
            <PlanCard key={i} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
