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

function Group() {
  return (
    <div className="marquee__group" aria-hidden="true">
      {WORDS.map((w, i) => (
        <span key={`${w}-${i}`}>{w}</span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="marquee">
      {/* two identical groups so the -50% translate loops seamlessly */}
      <div className="marquee__track">
        <Group />
        <Group />
      </div>
    </div>
  );
}
