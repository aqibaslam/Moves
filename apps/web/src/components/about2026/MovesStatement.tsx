import { ScrollRevealText } from '@/components/landing/ScrollRevealText';

/* Dark statement band (Figma 541:1877) — a large centred line on navy, followed
   by three white stat cards (Happy Client / Satisfaction Rate / Year Experience).
   The heading lights up word-by-word on scroll (same as the "who we are" line). */
const STATEMENT =
  'MOVES is more than clear aligners. It is the care behind smiles that finally feel free.';
const STATS = [
  { value: '10,000+', label: 'Happy Client' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '15+', label: 'Year Experience' },
];

export function MovesStatement() {
  return (
    <section className="about-statement">
      <div className="about-statement__inner">
        <h2 className="about-statement__title">
          <ScrollRevealText text={STATEMENT} />
        </h2>
        <div className="about-statement__stats">
          {STATS.map((s) => (
            <div className="about-statement__stat" key={s.label}>
              <p className="about-statement__stat-value">{s.value}</p>
              <p className="about-statement__stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
