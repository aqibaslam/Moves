import { mediaUrl } from '@/lib/media';
import { bookingHref } from '@/lib/booking/links';

/* Scalloped seal outline (Figma guarantee stamp). */
const SEAL_PATH =
  'M100.0 26.0A18.5 18.5 0 0 1 128.3 31.6A18.5 18.5 0 0 1 152.3 47.7A18.5 18.5 0 0 1 168.4 71.7A18.5 18.5 0 0 1 174.0 100.0A18.5 18.5 0 0 1 168.4 128.3A18.5 18.5 0 0 1 152.3 152.3A18.5 18.5 0 0 1 128.3 168.4A18.5 18.5 0 0 1 100.0 174.0A18.5 18.5 0 0 1 71.7 168.4A18.5 18.5 0 0 1 47.7 152.3A18.5 18.5 0 0 1 31.6 128.3A18.5 18.5 0 0 1 26.0 100.0A18.5 18.5 0 0 1 31.6 71.7A18.5 18.5 0 0 1 47.7 47.7A18.5 18.5 0 0 1 71.7 31.6A18.5 18.5 0 0 1 100.0 26.0Z';

export interface CtaData {
  title?: string;
  /* optional two-tone heading (rest + coral accent), overrides `title` */
  heading?: { rest?: string; accent?: string };
  subtext?: string;
  button?: { label?: string; href?: string };
  backgroundImage?: unknown;
  badge?: { topLabel?: string; midLabel?: string; bigNumber?: string; bottomLabel?: string };
}

export function CtaBanner({ data, variant }: { data?: CtaData; variant?: 'v2' }) {
  if (variant === 'v2') {
    // Updated Figma CTA: coral gradient card + portrait on the right (no seal).
    return (
      <section className="cta cta--v2" id="cta">
        <div className="cta__banner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cta__bg" src="/images/cta-gradient.png" alt="" aria-hidden="true" />
          <div className="cta__inner">
            <h2 className="cta__title">{data?.title ?? 'Your move'}</h2>
            <p className="cta__sub">
              {data?.subtext ??
                'Get the smile you’ve always wanted with a clear aligner treatment tailored to your needs.'}
            </p>
            <a className="btn btn--light btn--w250" href={bookingHref(data?.button?.href)}>
              {data?.button?.label ?? 'Book Free Consultation'}
            </a>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cta__woman" src="/images/cta-woman.png" alt="" aria-hidden="true" />
        </div>
      </section>
    );
  }

  return (
    <section className="cta" id="cta">
      <div className="cta__banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl(data?.backgroundImage, '/images/cta-bg.png')} alt="" aria-hidden="true" />

        <div className="cta__inner">
          <h2 className="cta__title">
            {data?.heading ? (
              <>
                {data.heading.rest ?? ''}
                <span className="c">{data.heading.accent ?? ''}</span>
              </>
            ) : (
              data?.title ?? 'Your MOVE'
            )}
          </h2>
          <p className="cta__sub">
            {data?.subtext ??
              'A free consultation, an honest answer, and a plan with a name on it.'}
          </p>
          <a className="btn btn--navy btn--w250" href={bookingHref(data?.button?.href)}>
            {data?.button?.label ?? 'Book Free Consultation'}
          </a>
        </div>

        <div className="cta__badge" aria-hidden="true">
          <svg className="cta__seal" viewBox="0 0 200 200">
            <defs>
              {/* top arc the ring text follows (semicircle over the top) */}
              <path id="cta-seal-arc" fill="none" d="M 40,100 A 60,60 0 0 1 160,100" />
            </defs>
            <path className="cta__seal-shape" d={SEAL_PATH} />
            <text className="cta__seal-ring">
              <textPath href="#cta-seal-arc" startOffset="50%" textAnchor="middle">
                {`${data?.badge?.topLabel ?? 'Money back'} ${data?.badge?.midLabel ?? 'Guarantee'}`.toUpperCase()}
              </textPath>
            </text>
            <text className="cta__seal-big" x="100" y="118" textAnchor="middle">
              {data?.badge?.bigNumber ?? '30'}
            </text>
            <text className="cta__seal-sub" x="100" y="146" textAnchor="middle">
              {(data?.badge?.bottomLabel ?? 'days').toUpperCase()}
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
