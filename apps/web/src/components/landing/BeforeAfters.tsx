const CARDS = [
  {
    before: 'ba-1-before',
    after: 'ba-1-after',
    name: 'Lisa A.',
    quote:
      '“I started eight months before my wedding so I wouldn’t spend the photos doing my careful smile. Best line in the whole planning spreadsheet.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-2-before',
    after: 'ba-2-after',
    name: 'Priya R.',
    quote:
      '“I used to talk with my hand near my mouth without noticing. Now I catch myself grinning in meetings. Nobody warned me about that part.”',
    signed: 'Signed by Dr. Amir Hussain',
  },
  {
    before: 'ba-2-before',
    after: 'ba-2-after',
    name: 'Sarah M.',
    quote:
      '“Fourteen weeks. The plan on my screen said fourteen weeks, and it was fourteen weeks. I’ve had sofas take longer to arrive.”',
    signed: 'Signed by Dr. Amelia Hart',
  },
  {
    before: 'ba-4-before',
    after: 'ba-4-after',
    name: 'Tom W.',
    quote:
      '“I stopped editing my smile out of photos, then noticed I’d started smiling in them. That’s the whole review, really.”',
    signed: 'Signed by Dr. Amir Hussain',
  },
];

export function BeforeAfters() {
  return (
    <section className="card-section ba">
      <div className="ba__head">
        <p className="eyebrow">BEFORE AND AFTERS</p>
        <h2 className="h-section">
          <span className="c">Real moves.</span> Signed.
        </h2>
        <p className="lead">
          Every case unretouched, originals on file, signed by the dentist responsible.
        </p>
      </div>

      <div className="ba__cards">
        {CARDS.map((c) => (
          <article className="bacard" key={c.name}>
            <div className="bacard__imgs">
              <div className="bacard__img">
                <span className="ba-chip">Before</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/${c.before}.png`} alt={`${c.name} before`} />
              </div>
              <div className="bacard__img">
                <span className="ba-chip">After</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/${c.after}.png`} alt={`${c.name} after`} />
              </div>
            </div>
            <h3 className="bacard__name">{c.name}</h3>
            <p className="bacard__quote">{c.quote}</p>
            <div className="bacard__foot">
              <span className="bacard__signed">{c.signed}</span>
              <span className="gdc-pill">GDC: 251837</span>
            </div>
          </article>
        ))}
      </div>

      <div className="dots" aria-hidden="true">
        <i className="on" />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </section>
  );
}
