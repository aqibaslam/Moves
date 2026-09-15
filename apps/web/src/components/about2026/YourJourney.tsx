/* "Your journey to a confident smile" (Figma 541:1934) — heading + supporting
   line + four numbered steps, each a brand icon in a dark disc with a title + body. */

function IconDisc({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="about-journey__icon" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="about-journey__icon-img" src={src} alt={alt} />
    </span>
  );
}

const STEPS: { icon: string; title: string; body: string }[] = [
  {
    title: 'Book a Consultation',
    body: 'Start with a free online consultation to see if clear aligners are right for you.',
    icon: '/images/journey-consultation.svg',
  },
  {
    title: 'Smile Assessment',
    body: 'Upload your photos or complete your digital smile assessment for expert review.',
    icon: '/images/journey-assessment.svg',
  },
  {
    title: 'Personalised Treatment',
    body: 'Your named GDC-registered dentist creates a custom treatment plan for you.',
    icon: '/images/journey-treatment.svg',
  },
  {
    title: 'Smile Journey',
    body: 'Receive your aligners and track your progress remotely.',
    icon: '/images/journey-smile.svg',
  },
];

export function YourJourney() {
  return (
    <section className="about-journey card-section">
      <div className="about-journey__head">
        <h2 className="about-journey__title">
          Your journey to a
          <br />
          <span className="ink-red">confident smile</span>
        </h2>
        <p className="about-journey__lead">
          From consultation to your confident smile, every stage is guided by a named GDC-registered
          dentist with continuous support throughout your treatment.
        </p>
      </div>
      <div className="about-journey__grid">
        {STEPS.map((s) => (
          <article className="about-journey__card" key={s.title}>
            <IconDisc src={s.icon} alt="" />
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
