import { Play } from './icons';
import { mediaUrl, mediaAlt } from '@/lib/media';

export interface ProofData {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  subtext?: string;
  videos?: { thumbnail?: unknown; video?: unknown; videoUrl?: string }[];
}

const TILES = ['proof-1', 'proof-2', 'proof-3', 'proof-4', 'proof-3'];

export function ProofInMotion({ data }: { data?: ProofData }) {
  const tiles = data?.videos?.length
    ? data.videos.map((v) => ({
        img: mediaUrl(v.thumbnail, ''),
        alt: mediaAlt(v.thumbnail, 'Patient story'),
      }))
    : TILES.map((img) => ({ img: `/images/${img}.png`, alt: 'Patient story' }));

  return (
    <section className="card-section proof">
      <div className="proof__head">
        <p className="eyebrow">{data?.eyebrow ?? 'PROOF IN MOTION'}</p>
        <h2 className="proof__title">
          {data?.heading?.accent ?? 'Real Smiles,'}{' '}
          <span className="ink">{data?.heading?.rest ?? 'real Stories'}</span>
        </h2>
        <p className="lead">
          {data?.subtext ??
            'MOVES isn’t a box in the post. Every patient is examined, scanned and fitted in person by a GDC-registered dentist, and every treatment plan carries that dentist’s signature.'}
        </p>
      </div>

      <div className="proof__grid">
        {tiles.map((t, i) => (
          <div className="ptile" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.img} alt={t.alt} />
            <span className="ptile__play">
              <Play />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
