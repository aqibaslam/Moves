import Link from 'next/link';

import { BOOKING_PATH } from '@/lib/booking/links';

import './legal.css';
import type { LegalBlock, LegalDoc } from './legal-content';

/* Legal page shell (Figma node 1824:5838 — Privacy Policy / Terms of Service,
   "2026, 24 Sep"): slim announcement bar, logo + outlined consultation CTA,
   a single reading column of numbered sections, and a compact dark footer.
   Server Component — nothing here needs client state. */

const ANNOUNCEMENT = 'Every MOVES® smile is signed by a GDC-registered dentist.';
const SUPPORT_EMAIL = 'support@movesuk.com';

function Block({ block }: { block: LegalBlock }) {
  if (block.type === 'p') return <p>{block.text}</p>;
  if (block.type === 'ul') {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className="legal__group">
      <p className="legal__group-title">{block.title}</p>
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="legal">
      <p className="legal__announce">{ANNOUNCEMENT}</p>

      <header className="legal__header">
        <Link href="/" className="legal__logo-link" aria-label="Moves — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="legal__logo" src="/images/lp26-logo.svg" alt="Moves" width={163} height={20} />
        </Link>
        <Link href={BOOKING_PATH} className="legal__cta">
          <span className="legal__cta-full">Book A Consultation</span>
          <span className="legal__cta-short">Consultation</span>
        </Link>
      </header>

      <main id="main" className="legal__main">
        <article className="legal__article">
          <h1 className="legal__title">{doc.title}</h1>

          <div className="legal__intro">
            {doc.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>

          <ol className="legal__sections">
            {doc.sections.map((section) => (
              <li key={section.heading} className="legal__section">
                <h2 className="legal__heading">{section.heading}</h2>
                <div className="legal__body">
                  {section.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </article>
      </main>

      <footer className="legal__footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="legal__footer-logo" src="/images/f26-foot-logo.svg" alt="Moves" />
        <nav className="legal__footer-links" aria-label="Legal">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms">Terms</Link>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </nav>
        <p className="legal__copy">© Copyright 2026, Move. All rights reserved.</p>
      </footer>
    </div>
  );
}
