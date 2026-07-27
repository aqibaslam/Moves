export function Manifesto() {
  return (
    <section className="manifesto">
      <div className="manifesto__bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/manifesto-bg.png" alt="" aria-hidden="true" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="manifesto__woman" src="/images/manifesto-woman.png" alt="A person laughing" />
      <div className="manifesto__glow" aria-hidden="true" />

      <p className="eyebrow manifesto__eyebrow">WHY WE&rsquo;RE CALLED MOVES</p>

      <div className="manifesto__inner">
        <h2 className="manifesto__title">
          Moves is <span className="dim">not a clear aligner company.</span>
          <br />
          <span className="dim">It is the moment behind modern smiles.</span>
        </h2>
        <p className="manifesto__sub">
          Aligner brands sell trays. Trays are the mechanism, the move is the product: from still to
          moving, from hiding to shown. Everything on this page is just how we get you there.
        </p>
      </div>

      <a className="btn btn--navy btn--w250 manifesto__btn" href="#cta">
        Book Free Consultation
      </a>
    </section>
  );
}
