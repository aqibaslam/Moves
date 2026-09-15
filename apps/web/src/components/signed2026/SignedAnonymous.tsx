/* "Treatment should never feel anonymous." (Figma 984:18684) — a navy band with a
   signed portrait card on the left and the statement heading + lead on the right. */
export function SignedAnonymous() {
  return (
    <section className="sg-anon">
      <div className="sg-anon__inner">
        <div className="sg-anon__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/signed-anon.png" alt="A signed MOVES treatment plan" />
        </div>
        <div className="sg-anon__copy">
          <h2 className="sg-anon__title">Treatment should never feel anonymous.</h2>
          <p className="sg-anon__lead">
            When you choose Moves, your treatment is connected to a qualified dentist from start to
            finish. That dentist is accountable for the plan, the decisions and your aftercare.
          </p>
        </div>
      </div>
    </section>
  );
}
