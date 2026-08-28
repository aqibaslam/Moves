import { BOOKING_PATH } from '@/lib/booking/links';

/* 2026 Home hero (Figma node 413:9264). Dark navy stage: an oversized "MOVES"
   wordmark sits behind a centred portrait holding an aligner, with the headline
   and a red CTA layered over the lower third. */
export function HeroBig() {
  return (
    <section className="lp26-hero">
      {/* oversized wordmark behind the portrait */}
      <span className="lp26-hero__mark" aria-hidden="true">
        MOVES<sup>&reg;</sup>
      </span>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp26-hero__photo" src="/images/lp26-hero.png" alt="A person holding a clear aligner" />

      <div className="lp26-hero__overlay">
        <h1 className="lp26-hero__title">
          Making moves towards <br />
          your perfect <span className="ink-red">smile.</span>
        </h1>
        <a className="btn lp26-btn" href={BOOKING_PATH}>
          Book Free Consultation
        </a>
      </div>
    </section>
  );
}
