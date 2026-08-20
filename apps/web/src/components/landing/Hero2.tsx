/* 2.0 hero body (Figma "New Moves Dental 2.0"). Full-bleed split background —
   coral aligner macro (left) + portrait (right) — with the white headline and
   CTA overlaid on the left. Sits under the shared Header inside .hero-unit. */

export interface Hero2Data {
  headline?: string;
  ratingLabel?: string;
  primaryButton?: { label?: string; href?: string };
}

export function Hero2({ data }: { data?: Hero2Data }) {
  return (
    <section className="h2" id="main">
      <div className="h2__bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="h2__img h2__img--left" src="/images/hero2-left.png" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="h2__img h2__img--right" src="/images/hero2-right.png" alt="" />
      </div>

      <div className="h2__inner">
        <div className="h2__copy">
          <h1 className="h2__title">
            {data?.headline ?? 'Making moves towards your perfect smile'}
          </h1>
          <a className="btn btn--light h2__cta" href={data?.primaryButton?.href ?? '/book'}>
            {data?.primaryButton?.label ?? 'Book Free Consultation'}
          </a>
        </div>
      </div>
    </section>
  );
}
