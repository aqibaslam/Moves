/* 2.0 "The one moment behind modern smiles." (Figma node 32:1235) — light
   card, heading, three rows of pill chips, aligner-in-hand image. */

// NOTE: the chip copy below is taken verbatim from the Figma, but it is clearly
// leftover placeholder text from a sustainability template ("biodiversity",
// "250–500 employees", "Somerset"). Swap `CHIPS` for real dental copy before
// go-live — see the suggested set in the PR description.
const CHIPS = [
  'UK-based biodiversity impact',
  'Built for 250–500+ employees',
  'Zero admin drag',
  'Professionally managed in Somerset',
  'Seasonal activity and biodiversity metrics',
  'Employee engagement and PR-ready content',
  'Turn abstract sustainability into a living story.',
  'What licenses or permits do I need?',
];

// Three visually-distinct rows (rotate the start index per row).
const ROWS = [0, 3, 6].map((offset) => CHIPS.map((_, i) => CHIPS[(i + offset) % CHIPS.length]));

export interface OneMomentData {
  heading?: { rest?: string; accent?: string };
}

export function OneMoment({ data }: { data?: OneMomentData }) {
  return (
    <section className="card-section one-moment">
      <div className="one-moment__card">
        <h2 className="one-moment__title">
          {data?.heading?.rest ?? 'The one moment behind'}{' '}
          <span className="c">{data?.heading?.accent ?? 'modern smiles.'}</span>
        </h2>

        <div className="one-moment__chips" aria-hidden="true">
          {ROWS.map((row, r) => (
            <div className="one-moment__chip-row" key={r}>
              {/* duplicate the chips so the marquee loops seamlessly; row 2 (index 1)
                  scrolls right→left, rows 1 & 3 scroll left→right */}
              <div className={`one-moment__chip-track ${r === 1 ? 'is-rtl' : 'is-ltr'}`}>
                {[...row, ...row].map((chip, i) => (
                  <span className="one-moment__chip" key={i}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="one-moment__figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/one-moment-hand.png" alt="A gloved hand holding a clear aligner" />
        </div>
      </div>
    </section>
  );
}
