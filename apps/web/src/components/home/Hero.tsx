import Image from 'next/image';
import { BOOKING_PATH } from '@/lib/booking/links';
import { ArrowRight, Tick } from './icons';
import { CTA_LABEL, HERO } from './content';

/* Hero: one big Ink panel with the smile filling its right half. The shoot's
   dark background melts into Ink, so photo and panel read as one surface. */
export function Hero() {
  const { photo } = HERO;
  return (
    <section className="mv-hero" id="main" aria-labelledby="hero-title">
      <div className="mv-panel">
        <div
          className="mv-panel__media"
          style={{ '--pos-d': photo.pos[0], '--pos-m': photo.pos[1] } as React.CSSProperties}
        >
          <Image
            className="mv-panel__img"
            src={photo.src}
            alt={photo.alt}
            fill
            preload
            sizes="(max-width: 899px) 100vw, 58vw"
          />
        </div>

        <div className="mv-panel__copy">
          <p className="mv-kicker mv-rise" style={{ '--i': 0 } as React.CSSProperties}>
            {HERO.kicker}
          </p>
          <h1
            className="mv-panel__title mv-rise"
            id="hero-title"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            {HERO.titleLead} <span className="mv-panel__accent">{HERO.titleAccent}</span>
          </h1>
          <ul className="mv-points mv-rise" style={{ '--i': 2 } as React.CSSProperties}>
            {HERO.points.map((pt) => (
              <li key={pt} className="mv-point">
                <span className="mv-point__icon" aria-hidden="true">
                  <Tick className="mv-icon" />
                </span>
                {pt}
              </li>
            ))}
          </ul>
          <a
            className="mv-btn mv-btn--pulse mv-btn--hero mv-rise"
            href={BOOKING_PATH}
            id="hero-cta"
            style={{ '--i': 3 } as React.CSSProperties}
          >
            {CTA_LABEL}
            <ArrowRight />
          </a>
          <p className="mv-rating mv-rise" style={{ '--i': 4 } as React.CSSProperties}>
            <strong>{HERO.proof.rating}</strong> {HERO.proof.count}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="mv-rating__stars"
              src="/images/tp-stars.png"
              alt=""
              aria-hidden="true"
            />
            <span className="mv-rating__brand">Trustpilot</span>
            <span className="mv-rating__sep" aria-hidden="true" />
            <span>{HERO.proof.finance}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
