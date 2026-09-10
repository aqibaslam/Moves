import { BOOKING_PATH } from '@/lib/booking/links';

/* "Clear Aligner Care That Moves With You" (Figma 413:17044) — a white section:
   heading + lead + CTA on top, then four grey icon cards. */

type Card = { icon: React.ReactNode; title: string; body: string };

const CARDS: Card[] = [
  {
    title: 'Dentist-Led Care',
    body: 'Your treatment is planned and reviewed by a named dentist who stays involved throughout your journey.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M12 3c-2.5 0-3.5 1.2-5 1.2S4 3.6 4 6.5C4 11 6 21 8 21c1.4 0 1.6-4 4-4s2.6 4 4 4c2 0 4-10 4-14.5 0-2.9-1.5-2.3-3-2.3S14.5 3 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Personalised Smile Plan',
    body: 'Your clear aligners are created around your teeth, goals and expected smile movement.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <rect x="4" y="9" width="16" height="10" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 9V7a4 4 0 0 1 8 0v2M9 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Progress Checked Regularly',
    body: 'We review your progress at each tray change, helping identify fit concerns before they become bigger problems.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M4 15l4-4 3 3 5-6 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Support Beyond the Aligners',
    body: 'You receive clear guidance, professional support and a care plan designed to keep your treatment moving forward.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M12 21s-7-4.3-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 3.5C19 16.7 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function ClearAlignerCare() {
  return (
    <section className="ca-care card-section">
      <div className="ca-care__head">
        <div className="ca-care__intro">
          <h2 className="ca-care__title">
            Clear aligner care that <span className="ca-care__accent">moves with you</span>
          </h2>
          <p className="ca-care__lead">
            From personalised planning to ongoing dentist-led support, MOVES gives you more confidence
            at every stage of treatment.
          </p>
        </div>
        <a className="btn lp26-btn ca-care__cta" href={BOOKING_PATH}>
          Book Free Consultation
        </a>
      </div>

      <div className="ca-care__grid">
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
