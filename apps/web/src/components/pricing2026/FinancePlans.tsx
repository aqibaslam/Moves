import { BOOKING_PATH } from '@/lib/booking/links';

/* "Prefer to spread the cost?" (Figma 984:11506) — finance section: heading +
   sub, four grey stat cards (coral label · big value · caption), centred CTA. */

const CARDS = [
  { label: 'Total treatment cost', value: '£2,495', caption: 'Align Package' },
  { label: 'Monthly estimate', value: '£83', caption: 'over 30 month' },
  { label: 'Representative APR', value: '0%', caption: '0% APR representative' },
  { label: 'Eligibility', value: 'Subject to status', caption: 'Confirmed before you start' },
];

export function FinancePlans() {
  return (
    <section className="card-section ph-fin">
      <div className="ph-fin__head">
        <h2 className="h-section ph-fin__title">
          Prefer to spread <span className="c">the cost?</span>
        </h2>
        <p className="ph-fin__sub">
          Monthly plans are available, subject to status. Your consultation gives you an estimate,
          and your dentist confirms the final package after your scan and assessment.
        </p>
      </div>

      <div className="ph-fin__grid">
        {CARDS.map((c) => (
          <article className="ph-fin__card" key={c.label}>
            <p className="ph-fin__label">{c.label}</p>
            <p className="ph-fin__value">{c.value}</p>
            <p className="ph-fin__caption">{c.caption}</p>
          </article>
        ))}
      </div>

      <a className="btn lp26-btn ph-fin__cta" href={BOOKING_PATH}>
        Book Free Consultation
      </a>
    </section>
  );
}
