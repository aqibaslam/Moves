/* "Your journey to a confident smile" (Figma 541:1934) — heading + supporting
   line + four numbered steps, each an icon in a dark disc with a title + body. */
import type { ReactNode } from 'react';

function IconDisc({ children }: { children: ReactNode }) {
  return (
    <span className="about-journey__icon" aria-hidden="true">
      {children}
    </span>
  );
}

const STEPS: { icon: ReactNode; title: string; body: string }[] = [
  {
    title: 'Book a Consultation',
    body: 'Start with a free online consultation to see if clear aligners are right for you.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Smile Assessment',
    body: 'Upload your photos or complete your digital smile assessment for expert review.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 8h3l1.5-2h7L18 8h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: 'Personalised Treatment',
    body: 'Your named GDC-registered dentist creates a custom treatment plan for you.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3c3 0 4 1.5 5.5 1.5S20 4 20 7c0 4-1.5 7-2.5 10-.6 1.7-1.2 1.6-1.7-.2l-1-3.8c-.4-1.4-1.2-1.4-1.6 0l-1 3.8c-.5 1.8-1.1 1.9-1.7.2C7.5 14 6 11 6 7c0-3 1-2.5 2.5-2.5S9 3 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Smile Journey',
    body: 'Receive your aligners and track your progress remotely.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M18 14l.7 1.6L20.5 16l-1.8.4L18 18l-.7-1.6L15.5 16l1.8-.4L18 14Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function YourJourney() {
  return (
    <section className="about-journey card-section">
      <div className="about-journey__head">
        <h2 className="about-journey__title">
          Your journey to a <span className="ink-red">confident smile</span>
        </h2>
        <p className="about-journey__lead">
          From consultation to your confident smile, every stage is guided by a named GDC-registered
          dentist with continuous support throughout your treatment.
        </p>
      </div>
      <div className="about-journey__grid">
        {STEPS.map((s) => (
          <article className="about-journey__card" key={s.title}>
            <IconDisc>{s.icon}</IconDisc>
            <div className="about-journey__card-text">
              <h3 className="about-journey__card-title">{s.title}</h3>
              <p className="about-journey__card-body">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
