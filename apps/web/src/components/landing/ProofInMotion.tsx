import { Play } from './icons';

const TILES = ['proof-1', 'proof-2', 'proof-3', 'proof-4', 'proof-3'];

export function ProofInMotion() {
  return (
    <section className="card-section proof">
      <div className="proof__head">
        <p className="eyebrow">PROOF IN MOTION</p>
        <h2 className="proof__title">
          Real Smiles, <span className="ink">real Stories</span>
        </h2>
        <p className="lead">
          MOVES isn&rsquo;t a box in the post. Every patient is examined, scanned and fitted in
          person by a GDC-registered dentist, and every treatment plan carries that dentist&rsquo;s
          signature.
        </p>
      </div>

      <div className="proof__grid">
        {TILES.map((img, i) => (
          <div className="ptile" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/${img}.png`} alt="Patient story" />
            <span className="ptile__play">
              <Play />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
