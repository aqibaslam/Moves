import { BOOKING_PATH } from '@/lib/booking/links';

/* "Your new smile starts here" (Figma 984:10537) — heading + lead + Book CTA on
   top, then two cards: "What we treat" (dark navy, coral ticks) and "May not
   suit" (light grey, coral crosses). */

const TREAT = [
  'Mild to moderate crowding',
  'Gaps and small spacing',
  'Mild rotation',
  'Relapse from teenage braces (teeth that drifted back)',
  'A single tooth that’s shifted',
];

const NOT_SUIT = [
  'Bite problems caused by jaw position rather than teeth',
  'Gaps left by missing teeth, or replacing missing teeth',
  'Active gum disease or unstable gums',
  'Teeth that are still developing',
];

function Tick() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M4.5 10.5 8.5 14.5 15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Cross() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HiwTreat() {
  return (
    <section className="hiw-treat card-section">
      <div className="hiw-treat__head">
        <div className="hiw-treat__intro">
          <h2 className="hiw-treat__title">
            Your new smile <span className="c">starts here</span>
          </h2>
          <p className="hiw-treat__lead">
            Book a free consultation to discuss your smile goals, explore your treatment options, and
            see clear pricing upfront with no pressure or obligation.
          </p>
        </div>
        <a className="btn lp26-btn hiw-treat__cta" href={BOOKING_PATH}>
          Book Free Consultation
        </a>
      </div>

      <div className="hiw-treat__grid">
        <article className="hiw-treat__card hiw-treat__card--dark">
          <h3 className="hiw-treat__card-title">What we treat</h3>
          <ul className="hiw-treat__list">
            {TREAT.map((t) => (
              <li key={t}>
                <span className="hiw-treat__ico hiw-treat__ico--tick">
                  <Tick />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </article>

        <article className="hiw-treat__card hiw-treat__card--light">
          <h3 className="hiw-treat__card-title">May not suit</h3>
          <ul className="hiw-treat__list">
            {NOT_SUIT.map((t) => (
              <li key={t}>
                <span className="hiw-treat__ico hiw-treat__ico--cross">
                  <Cross />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
