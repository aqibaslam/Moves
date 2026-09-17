import { ScrollRevealText } from '@/components/landing/ScrollRevealText';

/* "Treatment should never feel anonymous." (Figma 984:18684) — a navy band with a
   signed portrait card on the left and the statement heading + lead on the right.
   The heading uses the scroll-linked word brightness reveal (same as the
   funnel-2026 "A straighter smile…" heading). */
export function SignedAnonymous() {
  return (
    <section className="sg-anon">
      <div className="sg-anon__inner">
        <div className="sg-anon__media">
          {/* soft ground shadow beneath the cut-out */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sg-anon__shadow" src="/images/signed-ground-shadow.png" alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sg-anon__photo" src="/images/signed-anon.png" alt="A MOVES patient" />
        </div>
        <div className="sg-anon__copy">
          <h2 className="sg-anon__title">
            <ScrollRevealText text="Treatment should never feel anonymous." />
          </h2>
          <p className="sg-anon__lead">
            When you choose Moves, your treatment is connected to a qualified dentist from start to
            finish. That dentist is accountable for the plan, the decisions and your aftercare.
          </p>
        </div>
      </div>
    </section>
  );
}
