import { ScrollRevealText } from '@/components/landing/ScrollRevealText';

/* Coral statement band — Funnel page (Figma node 1495:14062).
   Layered composition: centred eyebrow + heading, woman in a coral arch,
   a hand-drawn white arrow pointing at her, and a "Why we're called MOVES"
   text block + CTA pinned to the right. */
export function CoralBand() {
  return (
    <section className="fb-coral">
      <div className="fb-coral__bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/funnel/2260aca52362.png" alt="" />
      </div>

      <div className="fb-coral__inner">
        <p className="fb-coral__eyebrow">WHY WE&rsquo;RE CALLED MOVES</p>

        <h2 className="fb-coral__title">
          <ScrollRevealText text="A Straighter Smile Is The Outcome. Confidence Is The Move." />
        </h2>

        {/* centred image: coral arch + woman + glow */}
        <div className="fb-coral__figure">
          <span className="fb-coral__arch" aria-hidden="true" />
          <span className="fb-coral__glow" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="fb-coral__woman" src="/images/funnel/coral-woman.png" alt="A person smiling" />
        </div>

        {/* white hand-drawn arrow pointing at the portrait */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="fb-coral__arrow" src="/images/funnel/coral-arrow.svg" alt="" aria-hidden="true" />

        {/* right-hand copy + CTA */}
        <div className="fb-coral__aside">
          <p className="fb-coral__label">Why we&rsquo;re called MOVES</p>
          <p className="fb-coral__body">
            MOVES turns clear aligner treatment into a guided journey from your first consultation
            to your signed plan, from every tray change to the moment you stop hiding your smile.
          </p>
          <a className="btn btn--navy fb-coral__cta" href="#cta">
            Book Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
