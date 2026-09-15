import { BOOKING_PATH } from '@/lib/booking/links';

/* "Composite Bonding Care That Moves With You" (Figma 984:7537) — reuses the
   clear-aligners care design (`.ca-care`): heading + lead + CTA on top, then four
   grey icon cards. Icons reuse the clear-aligners set. */

type Card = { icon: React.ReactNode; title: string; body: string };

const CARDS: Card[] = [
  {
    title: 'Dentist-Led Care',
    body: 'Your treatment is expertly crafted and applied by a qualified dentist who ensures precision at every step.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M12 3c-2.5 0-3.5 1.2-5 1.2S4 3.6 4 6.5C4 11 6 21 8 21c1.4 0 1.6-4 4-4s2.6 4 4 4c2 0 4-10 4-14.5 0-2.9-1.5-2.3-3-2.3S14.5 3 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Custom Tooth Sculpting',
    body: 'Resin is hand-shaped and color-matched to your natural enamel, enhancing shape, edge, and symmetry.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <rect x="4" y="9" width="16" height="10" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 9V7a4 4 0 0 1 8 0v2M9 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Same-Day Transformation',
    body: 'Achieve noticeable results in just one visit without drilling or damage to your natural teeth structure.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M4 15l4-4 3 3 5-6 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Lasting Smile Maintenance',
    body: 'Includes expert care instructions and follow-up polishing to preserve clarity, shine, and durability.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M12 21s-7-4.3-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 3.5C19 16.7 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function CompositeCare() {
  return (
    <section className="ca-care card-section">
      <div className="ca-care__head">
        <div className="ca-care__intro">
          <h2 className="ca-care__title">
            Composite bonding care that <span className="ca-care__accent">moves with you</span>
          </h2>
          <p className="ca-care__lead">
            From custom shade matching to expert dentist-led application, MOVES gives you instant
            confidence with seamless smile enhancements.
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
