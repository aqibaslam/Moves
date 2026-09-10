import { ScrollRevealText } from '@/components/landing/ScrollRevealText';

/* "Learn more about who we are" (Figma 541:1710) — heading, a photo + a
   scroll-revealed statement (words light up as you scroll, like funnel-2026),
   then Mission / Vision / Story columns under a divider. */
const STATEMENT =
  'Driven by purpose and built on innovation, we create meaningful digital experiences that empower people, accelerate business growth, and turn ideas into lasting success.';
const PILLARS = [
  {
    title: 'Our Mission',
    body: 'To create innovative digital solutions that help businesses grow and deliver exceptional user experiences.',
  },
  {
    title: 'Our Vision',
    body: 'To become a trusted global technology partner by building products that make a lasting impact.',
  },
  {
    title: 'Our Story',
    body: 'Started with a passion for innovation, we continue to design user-focused digital products that solve real-world challenges.',
  },
];

export function WhoWeAre() {
  return (
    <section className="about-who card-section">
      <h2 className="about-who__title">
        Learn more about <span className="ink-red">who<br />we are</span>
      </h2>

      <div className="about-who__row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="about-who__photo" src="/images/about-doctor.png" alt="A MOVES dentist" />
        <p className="about-who__statement">
          <ScrollRevealText text={STATEMENT} />
        </p>
      </div>

      <hr className="about-who__divider" />
      <div className="about-who__pillars">
        {PILLARS.map((p) => (
          <div className="about-who__pillar" key={p.title}>
            <h3 className="about-who__pillar-title">{p.title}</h3>
            <p className="about-who__pillar-body">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
