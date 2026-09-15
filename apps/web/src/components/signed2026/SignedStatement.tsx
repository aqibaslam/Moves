/* "Why we're called moves" statement (Figma 984:18504) — a centered light band:
   eyebrow, large statement heading, supporting paragraph. */
export function SignedStatement() {
  return (
    <section className="sg-statement">
      <div className="sg-statement__inner">
        <p className="sg-statement__eyebrow">WHY WE&rsquo;RE CALLED MOVES</p>
        <h2 className="sg-statement__title">
          Moves is not a clear aligner company. It is the moment behind modern smiles.
        </h2>
        <p className="sg-statement__body">
          Aligner brands sell trays. Trays are the mechanism the move is the product: from still to
          moving, from hiding to shown. Everything on this page is just how we get you there.
        </p>
      </div>
    </section>
  );
}
