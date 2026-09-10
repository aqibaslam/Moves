import { BOOKING_PATH } from '@/lib/booking/links';

/* 2026 Home hero (Figma node 413:9264). Dark navy stage: an oversized "MOVES"
   wordmark sits behind a centred portrait holding an aligner, with the headline
   and a red CTA layered over the lower third. */
export function HeroBig() {
  return (
    <section className="lp26-hero">
      {/* oversized wordmark behind the portrait (Figma "image 2947 [Vectorized]") */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp26-hero__mark" src="/images/lp26-hero-wordmark.svg" alt="" aria-hidden="true" />

      <picture className="lp26-hero__pic">
        {/* mobile portrait ≤900px (matches the stacked mobile hero layout) */}
        <source media="(max-width: 900px)" srcSet="/images/lp26-hero-mobile.png" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lp26-hero__photo" src="/images/lp26-hero.png" alt="A person holding a clear aligner" />
      </picture>

      <div className="lp26-hero__overlay">
        <h1 className="lp26-hero__title">
          Making moves towards <br className="lp26-hero__desk-br" />
          your perfect <span className="ink-red">smile.</span>
        </h1>
        <a className="btn lp26-btn" href={BOOKING_PATH}>
          Book Free Consultation
        </a>
      </div>
    </section>
  );
}
