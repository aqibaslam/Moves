import './booking.css';

import type { Metadata } from 'next';

import { BookingWizard } from '@/components/booking/BookingWizard';
import { Check } from '@/components/landing/icons';
import { TrustpilotWidget } from '@/components/landing/TrustpilotWidget';

export const metadata: Metadata = {
  title: 'Book your free consultation',
  description:
    'Book a free 45-minute online consultation with a named, GDC-registered dentist. Clear pricing, no pressure.',
};

const HIGHLIGHTS = [
  { title: '45-minute video call', body: 'Join online. We check suitability, give clear pricing and answer your questions.' },
  { title: '30-day money-back guarantee', body: 'Get your aligners completely risk-free if they aren’t right for you.' },
  { title: 'Extras included (worth £995)', body: 'Professional teeth whitening and retainers included as standard.' },
];

export default function BookingPage() {
  return (
    <main className="moves-page book-page" id="main">
      <div className="book-shell">
        <aside className="book-aside">
          <a className="book-brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/moves-logo.svg" alt="Moves" width={140} height={18} />
          </a>

          <div className="book-aside__intro">
            <span className="eyebrow">Free online consultation</span>
            <h1 className="book-title">
              <span className="c">Book the smile</span> you’ve been putting off
            </h1>
            <p className="book-lead">
              A named, GDC-registered dentist reviews your case, gives you clear pricing, and answers
              every question. No pressure — if aligners aren’t right for you, we’ll say so.
            </p>
          </div>

          <ul className="book-highlights">
            {HIGHLIGHTS.map((h) => (
              <li className="book-highlight" key={h.title}>
                <span className="book-highlight__icon" aria-hidden="true">
                  <Check />
                </span>
                <span>
                  <strong>{h.title}</strong>
                  <span className="book-highlight__body">{h.body}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="book-aside__trust">
            <TrustpilotWidget />
          </div>
        </aside>

        <div className="book-main">
          <BookingWizard />
        </div>
      </div>
    </main>
  );
}
