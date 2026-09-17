'use client';

import { useRef, useState } from 'react';

/* "Your smile, your timeline" (Figma 984:10438) — a heading + lead, a tab bar
   (Nudge / Shift / Align / Transform), and a horizontally-scrolling row of stage
   cards (photo on the left, title + time badge + copy + bullet list on the right).
   Clicking a tab scrolls its card into view. */

type Stage = {
  key: string;
  time: string;
  body: string;
  bullets: string[];
  photo: string;
};

const STAGES: Stage[] = [
  {
    key: 'Nudge',
    time: 'Up to 1 month',
    body: 'Ideal for minor relapse or very small corrections to keep your smile right on track.',
    bullets: ['Minor relapse', 'Small spacing', 'Quick refinement'],
    photo: '/images/pricing-care-portrait.png',
  },
  {
    key: 'Shift',
    time: '3–4 months',
    body: 'Designed for mild crowding or small gaps to gently guide your teeth into better alignment.',
    bullets: ['Mild crowding', 'Small gaps', 'Gentle guidance'],
    photo: '/images/composite-hero-portrait.png',
  },
  {
    key: 'Align',
    time: '4–6 months',
    body: 'For moderate crowding, spacing or rotation, aligning your teeth into a balanced, even smile.',
    bullets: ['Moderate crowding', 'Rotation', 'Even alignment'],
    photo: '/images/signed-hero-portrait.png',
  },
  {
    key: 'Transform',
    time: '6+ months',
    body: 'For fuller movement and bigger transformations, planned in detail and signed before you start.',
    bullets: ['Complex movement', 'Full arch', 'Signed plan'],
    photo: '/images/pricing-hero-portrait.png',
  },
];

export function HiwTimeline() {
  const [active, setActive] = useState(0);
  const cardsRef = useRef<HTMLDivElement>(null);

  const goTo = (i: number) => {
    setActive(i);
    const track = cardsRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (track && card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
  };

  return (
    <section className="hiw-tl card-section">
      <div className="hiw-tl__head">
        <h2 className="hiw-tl__title">
          Your smile, <span className="c">your timeline</span>
        </h2>
        <p className="hiw-tl__lead">
          Treatment time depends on how far your teeth need to move and the complexity of your case,
          with your exact timeline confirmed after your scan.
        </p>
      </div>

      <div className="hiw-tl__tabs" role="tablist" aria-label="Treatment stages">
        {STAGES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`hiw-tl__tab${i === active ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
          >
            {s.key}
          </button>
        ))}
      </div>

      <div className="hiw-tl__cards" ref={cardsRef}>
        {STAGES.map((s) => (
          <article className="hiw-tl__card" key={s.key}>
            <div className="hiw-tl__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.photo} alt="" aria-hidden="true" />
            </div>
            <div className="hiw-tl__body">
              <h3 className="hiw-tl__stage">{s.key}</h3>
              <p className="hiw-tl__time">{s.time}</p>
              <p className="hiw-tl__desc">{s.body}</p>
              <ul className="hiw-tl__bullets">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
