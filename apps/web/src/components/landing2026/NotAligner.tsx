import { BOOKING_PATH } from '@/lib/booking/links';

const BENEFITS = ['Clearer', 'Comfortable', 'More confidence', 'More freedom'];

/* "Moves is not a clear aligner company" (Figma node 413:9579). Dark navy split:
   a portrait with floating benefit pills on the left, statement + checklist +
   CTA on the right. */
export function NotAligner() {
  return (
    <section className="lp26-nac">
      <div className="lp26-nac__inner">
      <div className="lp26-nac__media">
        {/* blue dome behind the portrait (Figma: linear-gradient #091620 → #6174A5) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lp26-nac__dome" src="/images/lp26-nac-dome.png" alt="" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lp26-nac__photo" src="/images/lp26-nac-woman.png" alt="A person wearing a clear aligner" />
        <span className="lp26-nac__pill lp26-nac__pill--a">More confidence</span>
        <span className="lp26-nac__pill lp26-nac__pill--b">A smile you want to show</span>
        <span className="lp26-nac__pill lp26-nac__pill--c">Subtle progress that feels natural</span>
      </div>

      <div className="lp26-nac__body">
        <h2 className="lp26-nac__title">
          Moves is not a clear aligner company. It is the moment behind modern{' '}
          <span className="ink-red">smiles.</span>
        </h2>
        <p className="lp26-nac__lead">
          Aligner brands sell trays. Trays are the mechanism, the move is the product: from still to
          moving, from hiding to shown. Everything on this page is just how we get you there.
        </p>
        <p className="lp26-nac__lead">
          When your smile starts moving, you notice more than straighter teeth:
        </p>
        <ul className="lp26-nac__list">
          {BENEFITS.map((b) => (
            <li key={b}>
              <span className="lp26-nac__check" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5.5 9.2 8 11.5l4.2-4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {b}
            </li>
          ))}
        </ul>
        <a className="btn lp26-btn" href={BOOKING_PATH}>
          Book Free Consultation
        </a>
      </div>
      </div>
    </section>
  );
}
