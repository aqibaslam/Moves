export interface MarqueeData {
  words?: { text?: string }[];
}

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

function Group({ words }: { words: string[] }) {
  return (
    <div className="marquee__group" aria-hidden="true">
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>{w}</span>
      ))}
    </div>
  );
}

export function Marquee({ data }: { data?: MarqueeData }) {
  const words = data?.words?.length ? data.words.map((w) => w.text ?? '') : WORDS;

  return (
    <div className="marquee">
      {/* two identical groups so the -50% translate loops seamlessly */}
      <div className="marquee__track">
        <Group words={words} />
        <Group words={words} />
      </div>
    </div>
  );
}
