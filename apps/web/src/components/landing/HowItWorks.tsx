const STEPS = [
  {
    num: 'STEP 01',
    title: 'Scan day',
    body: 'Twenty minutes, in person, with a dentist. A 3D scan — and if aligners won’t work for you, we say so, and you pay nothing.',
  },
  {
    num: 'STEP 02',
    title: 'The signed plan',
    body: 'Every stage of the move, on screen, before you pay a pound. Signed by name, with a GDC number you can look up in eight seconds.',
  },
  {
    num: 'STEP 03',
    title: 'In motion',
    body: 'Aligners made in Germany, finished by hand, delivered to your door. Check-ins reach you before you have to ask, stage by stage.',
  },
];

export function HowItWorks() {
  return (
    <section className="card-section how">
      <div className="how__head">
        <div className="how__head-l">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2 className="h-section">
            <span className="c">You move,</span> in Three moves
          </h2>
          <p className="lead">
            No postal impression kits. No anonymous review team. A dentist, a scanner, a signature
            then motion.
          </p>
        </div>
        <a className="btn btn--navy btn--w250" href="#cta">
          Book Free Consultation
        </a>
      </div>

      <div className="how__steps">
        {STEPS.map((s, i) => (
          <div className="step" key={s.num}>
            <div className="step__top">
              <span className="step__num">{s.num}</span>
              <h3 className="step__title">{s.title}</h3>
            </div>
            <div className={`step__media${i === 0 ? ' step__media--stack' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/step${i + 1}${i === 0 ? '-a' : ''}.png`} alt={s.title} />
              {i === 0 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/images/step1-b.png"
                  alt=""
                  aria-hidden="true"
                  style={{ left: '58%', top: 0, height: '70%' }}
                />
              )}
            </div>
            <p className="step__body">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
