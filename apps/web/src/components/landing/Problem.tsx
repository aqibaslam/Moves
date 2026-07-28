'use client';

import { useState } from 'react';
import { mediaUrl } from '@/lib/media';

export interface ProblemData {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  items?: { text?: string; image?: unknown }[];
  note?: string;
}

// Each "wrong move" gets its own image, so hovering a heading swaps the slide
// (Dermatica-style). Images reuse the page's existing portraits.
const ITEMS = [
  { t: 'Closed-mouth photo', img: 'problem-portrait' },
  { t: 'Hand over your mouth, mid-laugh', img: 'hero-portrait' },
  { t: 'Turn away from the camera', img: 'manifesto-woman' },
  { t: 'Photo you took, then deleted.', img: 'ba-1-before' },
  { t: '“Careful” smile.', img: 'ba-1-after' },
  { t: 'Camera off, again.', img: 'ba-2-before' },
];

export function Problem({ data }: { data?: ProblemData }) {
  const [active, setActive] = useState(0);

  const items = data?.items?.length
    ? data.items.map((it) => ({ text: it.text ?? '', img: mediaUrl(it.image, '') }))
    : ITEMS.map((it) => ({ text: it.t, img: `/images/${it.img}.png` }));

  return (
    <section className="card-section problem">
      <div className="problem__head">
        <p className="eyebrow">{data?.eyebrow ?? 'THE MOVES YOU ALREADY MAKE'}</p>
        <h2 className="h-section">
          {data?.heading?.rest ?? 'Your’ve been making moves for years.'}{' '}
          <span className="c">{data?.heading?.accent ?? 'Just the wrong ones.'}</span>
        </h2>
      </div>

      <div className="problem__body">
        <div className="problem__list">
          <ul className="problem__items">
            {items.map((it, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`problem__item${i === active ? ' active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-pressed={i === active}
                >
                  {it.text}
                </button>
              </li>
            ))}
          </ul>
          <p className="problem__note">
            {data?.note ??
              'Nobody buys aligners. People buy the moment they stop hiding. If you recognise more than two of these, you already know which moment we mean.'}
          </p>
        </div>

        <div className="problem__media">
          {items.map((it, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              className={`problem__slide${i === active ? ' on' : ''}`}
              src={it.img}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          ))}
          <div className="progress" aria-hidden="true">
            {items.map((it, i) => (
              <i key={i} className={i === active ? 'on' : undefined} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
