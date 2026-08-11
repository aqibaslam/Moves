import { mediaUrl } from '@/lib/media';
import { bookingHref } from '@/lib/booking/links';

export interface MoversData {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  subtext?: string;
  button?: { label?: string; href?: string };
  tiers?: { icon?: unknown; title?: string; body?: string }[];
}

const TIERS = [
  {
    icon: 'icon-target',
    title: 'Mover',
    body: 'You make the first move: scan day, your own code, your smile in motion.',
  },
  {
    icon: 'icon-megaphone',
    title: 'Advocate',
    body: 'A friend moves on your code. You both get rewarded, every time.',
  },
  {
    icon: 'icon-folder-edit',
    title: 'Creator',
    body: 'Your story becomes the brand: shoots, features, your move on our channels.',
  },
  {
    icon: 'icon-shield-half',
    title: 'Insider',
    body: 'First look at everything next. New products, new cities, before anyone.',
  },
];

export function Movers({ data }: { data?: MoversData }) {
  const tiers = data?.tiers?.length
    ? data.tiers.map((t) => ({
        icon: mediaUrl(t.icon, ''),
        title: t.title ?? '',
        body: t.body ?? '',
      }))
    : TIERS.map((t) => ({ icon: `/images/${t.icon}.svg`, title: t.title, body: t.body }));

  return (
    <section className="card-section movers">
      <div className="movers__head">
        <div className="movers__head-l">
          <p className="eyebrow">{data?.eyebrow ?? 'THE MOVERS'}</p>
          <h2 className="h-section">
            <span className="c">{data?.heading?.accent ?? 'You don’t buy moves.'}</span>{' '}
            {data?.heading?.rest ?? 'You join it.'}
          </h2>
          <p className="lead">
            {data?.subtext ??
              'Every patient becomes a Mover on scan day: a code of your own, rewards when a friend makes their move, first look at whatever we do next. The best Movers end up making the brand with us.'}
          </p>
        </div>
        <a
          className="btn btn--navy btn--w250 movers__cta movers__cta--head"
          href={bookingHref(data?.button?.href)}
        >
          {data?.button?.label ?? 'Book Free Consultation'}
        </a>
      </div>

      <div className="movers__tiers">
        {tiers.map((t, i) => (
          <div className="tier" key={i}>
            <span className="tier__icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.icon} alt="" aria-hidden="true" width={24} height={24} />
            </span>
            <div className="tier__text">
              <h3 className="tier__title">{t.title}</h3>
              <p className="tier__body">{t.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* mobile-only CTA: Figma places it beneath the role cards */}
      <a
        className="btn btn--navy movers__cta movers__cta--foot"
        href={bookingHref(data?.button?.href)}
      >
        {data?.button?.label ?? 'Book Free Consultation'}
      </a>
    </section>
  );
}
