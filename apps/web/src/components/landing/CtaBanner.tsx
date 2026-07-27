import { Starburst } from './icons';

export function CtaBanner() {
  return (
    <section className="cta" id="cta">
      <div className="cta__banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/cta-bg.png" alt="" aria-hidden="true" />

        <div className="cta__inner">
          <h2 className="cta__title">Your MOVE</h2>
          <p className="cta__sub">
            A free consultation, an honest answer, and a plan with a name on it.
          </p>
          <a className="btn btn--navy btn--w250" href="#">
            Book Free Consultation
          </a>
        </div>

        <div className="cta__badge" aria-hidden="true">
          <Starburst />
          <div className="cta__badge-txt">
            <span className="lbl">Money back</span>
            <span className="lbl">Guarantee</span>
            <span className="big">30</span>
            <span className="lbl">days</span>
          </div>
        </div>
      </div>
    </section>
  );
}
