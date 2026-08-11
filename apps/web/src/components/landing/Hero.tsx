import { TrustpilotWidget } from './TrustpilotWidget';
import { mediaUrl, mediaAlt } from '@/lib/media';
import { bookingHref } from '@/lib/booking/links';

export interface HeroData {
  ratingCount?: string;
  headline?: { accent?: string; rest?: string };
  subhead?: string;
  primaryButton?: { label?: string; href?: string };
  secondaryLinkLabel?: string;
  heroImage?: unknown;
  signature?: { name?: string; line1?: string; line2?: string };
}

export function Hero({ data }: { data?: HeroData }) {
  return (
    <section className="hero" id="main">
      <div className="hero__left">
        <div className="hero__intro">
          <div className="rating">
            <TrustpilotWidget />
          </div>

          <h1 className="h-hero">
            <span className="c">{data?.headline?.accent ?? 'The smile'}</span>{' '}
            {data?.headline?.rest ?? 'you’ve been putting off'}
          </h1>

          <p className="hero__sub">
            {data?.subhead ??
              'MOVES is the movement behind modern smiles. Planned in person, signed by a named GDC-registered dentist, at a price we publish. The smile is yours, the signature means you never move alone.'}
          </p>
        </div>

        <div className="hero__cta">
          <a className="btn btn--navy btn--w250" href={bookingHref(data?.primaryButton?.href)}>
            {data?.primaryButton?.label ?? 'Book Free Consultation'}
          </a>
          <a className="hero__link" href="#pricing">
            <span>{data?.secondaryLinkLabel ?? 'See exactly what it costs'}</span>
            <i />
          </a>
        </div>

        <div className="sigcard">
          <span className="sigcard__name">{data?.signature?.name ?? 'Amelia Hart'}</span>
          <span className="sigcard__div" />
          <div className="sigcard__meta">
            <span className="muted">{data?.signature?.line1 ?? 'SIGNED · GDC No. 123456'}</span>
            <span className="strong">
              {data?.signature?.line2 ?? 'ON THE PLAN. IN YOUR ACCOUNT. ON THE BOX.'}
            </span>
          </div>
        </div>
      </div>

      <div className="hero__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero__img hero__img--desktop"
          src={mediaUrl(data?.heroImage, '/images/hero-portrait.png')}
          alt={mediaAlt(data?.heroImage, 'A person smiling confidently')}
        />
        {/* mobile-only hero image — pink background + shadow baked in */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero__img hero__img--mobile"
          src="/images/hero-portrait-mobile.png"
          alt=""
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
