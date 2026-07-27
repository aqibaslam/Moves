const WORDS = [
  'MAKING MOVES',
  'SMILES IN MOTION',
  'YOUR MOVE',
  'FIRST MOVE',
  'SIGNED',
  'SIGNED',
  'SMILES IN MOTION',
  'FIRST MOVE',
];

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__row">
        {WORDS.map((w, i) => (
          <span key={`${w}-${i}`}>{w}</span>
        ))}
      </div>
    </div>
  );
}
