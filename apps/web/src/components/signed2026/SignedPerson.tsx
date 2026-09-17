import { BOOKING_PATH } from '@/lib/booking/links';

/* "There is a real person behind every plan." — a light band (reuses the
   clear-aligners care design `.ca-care`): heading + lead + CTA on top, then
   three grey icon cards (Assessed in person / Plan signed / Aftercare owned). */

type Card = { icon: string; title: string; body: string };

const CARDS: Card[] = [
  {
    title: 'Assessed in person',
    body: 'A qualified dentist assesses your teeth, bite and suitability before treatment begins.',
    icon: '/images/signed-icon-assessed.svg',
  },
  {
    title: 'Plan signed',
    body: 'Your treatment plan is reviewed and signed by the dentist responsible for your care.',
    icon: '/images/signed-icon-plan.svg',
  },
  {
    title: 'Aftercare owned',
    body: 'Your dentist remains responsible for your clinical aftercare and support throughout treatment.',
    icon: '/images/signed-icon-aftercare.svg',
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
            <span className="ca-care__icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.icon} alt="" aria-hidden="true" width={24} height={24} />
            </span>
            <h3 className="ca-care__card-title">{c.title}</h3>
            <p className="ca-care__card-body">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
