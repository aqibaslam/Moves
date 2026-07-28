import { mediaUrl, mediaAlt } from '@/lib/media';

export interface ManifestoData {
  eyebrow?: string;
  heading?: { bright?: string; dim?: string };
  subtext?: string;
  button?: { label?: string; href?: string };
  backgroundImage?: unknown;
  portrait?: unknown;
}

export function Manifesto({ data }: { data?: ManifestoData }) {
  const hasHeading = Boolean(data?.heading?.bright || data?.heading?.dim);

  return (
    <section className="manifesto">
      <div className="manifesto__bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(data?.backgroundImage, '/images/manifesto-bg.png')}
          alt=""
          aria-hidden="true"
        />
      </div>

      <p className="eyebrow manifesto__eyebrow">{data?.eyebrow ?? 'WHY WE’RE CALLED MOVES'}</p>

      <h2 className="manifesto__title">
        {hasHeading ? (
          <>
            {data?.heading?.bright} <span className="dim">{data?.heading?.dim}</span>
          </>
        ) : (
          <>
            Moves is <span className="dim">not a clear aligner company.</span>
            <br />
            <span className="dim">It is the moment behind modern smiles.</span>
          </>
        )}
      </h2>

      <p className="manifesto__sub">
        {data?.subtext ??
          'Aligner brands sell trays. Trays are the mechanism, the move is the product: from still to moving, from hiding to shown. Everything on this page is just how we get you there.'}
      </p>

      <div className="manifesto__figure">
        <span className="manifesto__glow" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="manifesto__woman"
          src={mediaUrl(data?.portrait, '/images/manifesto-woman.png')}
          alt={mediaAlt(data?.portrait, 'A person laughing')}
        />
      </div>

      <a
        className="btn btn--navy btn--w250 manifesto__btn"
        href={data?.button?.href ?? '#cta'}
      >
        {data?.button?.label ?? 'Book Free Consultation'}
      </a>
    </section>
  );
}
