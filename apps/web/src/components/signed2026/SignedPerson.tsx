import { BOOKING_PATH } from '@/lib/booking/links';

/* "There is a real person behind every plan." (Figma 984:18594) — reuses the
   clear-aligners care design (`.ca-care`): heading + lead + CTA on top, then three
   grey icon cards (Assessed in person / Plan signed / Aftercare owned). */

type Card = { icon: React.ReactNode; title: string; body: string };

const CARDS: Card[] = [
  {
    title: 'Assessed in person',
    body: 'A qualified dentist assesses your teeth, bite and suitability before treatment begins.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M12 3c-2.5 0-3.5 1.2-5 1.2S4 3.6 4 6.5C4 11 6 21 8 21c1.4 0 1.6-4 4-4s2.6 4 4 4c2 0 4-10 4-14.5 0-2.9-1.5-2.3-3-2.3S14.5 3 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Plan signed',
    body: 'Your treatment plan is reviewed and signed by the dentist responsible for your care.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M4 17.5 14 7.5l2.5 2.5L6.5 20H4v-2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M13 8.5 15.5 11M4 21h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Aftercare owned',
    body: 'Your dentist remains responsible for your clinical aftercare and support throughout treatment.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M12 21s-7-4.3-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 3.5C19 16.7 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function SignedPerson() {
  return (
    <section className="ca-care card-section sg-person">
      <div className="ca-care__head">
        <div className="ca-care__intro">
          <h2 className="ca-care__title">
            There is a real person behind<span className="ca-care__accent"> every plan.</span>
          </h2>
          <p className="ca-care__lead">
            &ldquo;Signed&rdquo; is our shorthand for a simple standard: your treatment has a clinician,
            your clinician has a name, and that name stays connected to your care.
          </p>
        </div>
        <a className="btn lp26-btn ca-care__cta" href={BOOKING_PATH}>
          Book Free Consultation
        </a>
      </div>

      <div className="ca-care__grid sg-person__grid">
        {CARDS.map((c) => (
          <div className="ca-care__card" key={c.title}>
            <span className="ca-care__icon">{c.icon}</span>
            <h3 className="ca-care__card-title">{c.title}</h3>
            <p className="ca-care__card-body">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
