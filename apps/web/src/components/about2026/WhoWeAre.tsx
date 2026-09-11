import { ScrollRevealText } from '@/components/landing/ScrollRevealText';

/* "Who we are" (Figma 1189:1250) — a large centred statement (words light up as
   you scroll, dim grey → dark) followed by Mission / Vision / Story cards, each
   led by a dark circular icon. */
const STATEMENT =
  'Driven by purpose and built on innovation, we create meaningful digital experiences that empower people, accelerate business growth, and turn ideas into lasting success.';

function IconMission() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconVision() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}
function IconStory() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 6.5C10.6 5.6 8.7 5 6.5 5 5.3 5 4.2 5.2 3.3 5.5A1 1 0 0 0 2.6 6.4v11a1 1 0 0 0 1.3 1c.8-.3 1.8-.4 2.6-.4 2.2 0 4.1.6 5.5 1.5" />
      <path d="M12 6.5C13.4 5.6 15.3 5 17.5 5c1.2 0 2.3.2 3.2.5a1 1 0 0 1 .7.9v11a1 1 0 0 1-1.3 1c-.8-.3-1.8-.4-2.6-.4-2.2 0-4.1.6-5.5 1.5" />
      <path d="M12 6.5V19.5" />
    </svg>
  );
}

const PILLARS = [
  {
    Icon: IconMission,
    title: 'Our Mission',
    body: 'To create innovative digital solutions that help businesses grow and deliver exceptional user experiences.',
  },
  {
    Icon: IconVision,
    title: 'Our Vision',
    body: 'To become a trusted global technology partner by building products that make a lasting impact.',
  },
  {
    Icon: IconStory,
    title: 'Our Story',
    body: 'Started with a passion for innovation, we continue to design user-focused digital products that solve real-world challenges.',
  },
];

export function WhoWeAre() {
  return (
    <section className="about-who card-section">
      <h2 className="about-who__statement">
        <ScrollRevealText text={STATEMENT} />
      </h2>

      <div className="about-who__cards">
        {PILLARS.map(({ Icon, title, body }) => (
          <div className="about-who__card" key={title}>
            <span className="about-who__icon">
              <Icon />
            </span>
            <h3 className="about-who__pillar-title">{title}</h3>
            <p className="about-who__pillar-body">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
