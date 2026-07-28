import { Starburst } from './icons';
import { mediaUrl } from '@/lib/media';

export interface CtaData {
  title?: string;
  subtext?: string;
  button?: { label?: string; href?: string };
  backgroundImage?: unknown;
  badge?: { topLabel?: string; midLabel?: string; bigNumber?: string; bottomLabel?: string };
}

export function CtaBanner({ data }: { data?: CtaData }) {
  return (
    <section className="cta" id="cta">
      <div className="cta__banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl(data?.backgroundImage, '/images/cta-bg.png')} alt="" aria-hidden="true" />

        <div className="cta__inner">
          <h2 className="cta__title">{data?.title ?? 'Your MOVE'}</h2>
          <p className="cta__sub">
            {data?.subtext ??
              'A free consultation, an honest answer, and a plan with a name on it.'}
          </p>
          <a className="btn btn--navy btn--w250" href={data?.button?.href ?? '#'}>
            {data?.button?.label ?? 'Book Free Consultation'}
          </a>
        </div>

        <div className="cta__badge" aria-hidden="true">
          <Starburst />
          <div className="cta__badge-txt">
            <span className="lbl">{data?.badge?.topLabel ?? 'Money back'}</span>
            <span className="lbl">{data?.badge?.midLabel ?? 'Guarantee'}</span>
            <span className="big">{data?.badge?.bigNumber ?? '30'}</span>
            <span className="lbl">{data?.badge?.bottomLabel ?? 'days'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
