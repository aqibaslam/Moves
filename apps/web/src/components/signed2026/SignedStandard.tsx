import { BOOKING_PATH } from '@/lib/booking/links';

/* "Three things happen before we call it Signed." — a heading + lead across the
   top, then a two-column row: the dentist photo on the left and the three-point
   standard + CTA on the right. */

const ITEMS = [
  {
    title: 'Dentist name',
    body: 'The person responsible for your treatment plan.',
  },
  {
    title: 'Credential line',
    body: 'Clear professional credentials shown alongside their name.',
  },
  {
    title: 'Registration stays private',
    body: 'GDC registration details remain on patient treatment documents, not on this public page.',
  },
];

export function SignedStandard() {
  return (
    <section className="sg-standard">
      <div className="sg-standard__inner">
        <div className="sg-standard__head">
          <h2 className="sg-standard__title">
            Three things happen before we call<span className="c"> it Signed.</span>
          </h2>
          <p className="sg-standard__lead">
            Simple on purpose. Every MOVES treatment follows the same fundamental standard.
          </p>
        </div>

        <div className="sg-standard__row">
          <div className="sg-standard__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/signed-standard.png" alt="A GDC-registered MOVES dentist" />
          </div>

          <div className="sg-standard__content">
            <ol className="sg-standard__list">
              {ITEMS.map((it) => (
                <li className="sg-standard__item" key={it.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="sg-standard__num"
                    src="/images/signed-check.svg"
                    alt=""
                    aria-hidden="true"
                    width={22}
                    height={22}
                  />
                  <div className="sg-standard__text">
                    <h3 className="sg-standard__item-title">{it.title}</h3>
                    <p className="sg-standard__item-body">{it.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a className="btn lp26-btn sg-standard__cta" href={BOOKING_PATH}>
              Book Free Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
