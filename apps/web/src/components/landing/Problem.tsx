'use client';

import { useState } from 'react';

export interface ProblemData {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  items?: { text?: string; image?: unknown }[];
  note?: string;
}

// Each "wrong move" gets its own image, so hovering a heading swaps the slide
// (Dermatica-style). Images reuse the page's existing portraits.
const ITEMS = [
  { t: 'Closed-mouth photo', img: 'problem-1' },
  { t: 'Hand over your mouth, mid-laugh', img: 'problem-2' },
  { t: 'Turn away from the camera', img: 'problem-3' },
  { t: 'Photo you took, then deleted.', img: 'problem-4' },
  { t: '“Careful” smile.', img: 'problem-5' },
  { t: 'Camera off, again.', img: 'problem-6' },
];

export function Problem({ data }: { data?: ProblemData }) {
  const [active, setActive] = useState(0);

  // Text can still come from the CMS; the images are the dedicated Figma
  // photos (problem-1…6) mapped by position — they're specific to this
  // section, unlike the shared CMS portraits used elsewhere.
  const texts = data?.items?.length
    ? data.items.map((it) => it.text ?? '')
    : ITEMS.map((it) => it.t);
  const items = texts.map((text, i) => ({
    text,
    img: `/images/problem-${Math.min(i + 1, ITEMS.length)}.png`,
  }));

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
