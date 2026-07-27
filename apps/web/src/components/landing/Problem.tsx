const ITEMS = [
  { t: 'Closed-mouth photo', active: true },
  { t: 'Hand over your mouth, mid-laugh', active: false },
  { t: 'Turn away from the camera', active: false },
  { t: 'Photo you took, then deleted.', active: false },
  { t: '“Careful” smile.', active: false },
  { t: 'Camera off, again.', active: false },
];

export function Problem() {
  return (
    <section className="card-section problem">
      <div className="problem__head">
        <p className="eyebrow">THE MOVES YOU ALREADY MAKE</p>
        <h2 className="h-section">
          Your&rsquo;ve been making moves for years. <span className="c">Just the wrong ones.</span>
        </h2>
      </div>

      <div className="problem__body">
        <div className="problem__list">
          <div className="problem__items">
            {ITEMS.map((it) => (
              <p key={it.t} className={it.active ? 'active' : undefined}>
                {it.t}
              </p>
            ))}
          </div>
          <p className="problem__note">
            Nobody buys aligners. People buy the moment they stop hiding. If you recognise more than
            two of these, you already know which moment we mean.
          </p>
        </div>

        <div className="problem__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/problem-portrait.png" alt="Portrait of a person" />
          <div className="progress" aria-hidden="true">
            <i className="on" />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
