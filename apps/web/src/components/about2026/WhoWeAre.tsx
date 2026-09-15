import { ScrollRevealText } from '@/components/landing/ScrollRevealText';

/* "Who we are" (Figma 1189:1250) — a large centred statement (words light up as
   you scroll, dim grey → dark) followed by Mission / Vision / Story cards, each
   led by a dark circular icon. */
const STATEMENT =
  'Driven by purpose and built on innovation, we create meaningful digital experiences that empower people, accelerate business growth, and turn ideas into lasting success.';

const PILLARS = [
  {
    icon: '/images/who-mission.svg',
    title: 'Our Mission',
    body: 'To create innovative digital solutions that help businesses grow and deliver exceptional user experiences.',
  },
  {
    icon: '/images/who-vision.svg',
    title: 'Our Vision',
    body: 'To become a trusted global technology partner by building products that make a lasting impact.',
  },
  {
    icon: '/images/who-story.svg',
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
        {PILLARS.map(({ icon, title, body }) => (
          <div className="about-who__card" key={title}>
            <span className="about-who__icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="about-who__icon-img" src={icon} alt="" aria-hidden="true" />
            </span>
            <h3 className="about-who__pillar-title">{title}</h3>
            <p className="about-who__pillar-body">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
