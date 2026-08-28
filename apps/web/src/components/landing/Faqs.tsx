'use client';

import { useState } from 'react';
import { Plus } from './icons';

export interface FaqsData {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  description?: string;
  cta?: { label?: string; href?: string };
  items?: { question?: string; answer?: string }[];
}

// Questions are verbatim from Figma; the design ships them collapsed with no
// answer copy, so these answers are written from the page's own claims.
// Edit freely — they're content, not layout.
const FAQS = [
  {
    q: 'What is MOVES?',
    a: 'MOVES is the movement behind modern smiles: a clear-aligner treatment planned in person and signed by a named, GDC-registered dentist, at a price we publish up front.',
  },
  {
    q: 'Who signs my treatment plan?',
    a: 'A named, GDC-registered dentist examines and scans you in person, then signs your plan. Their GDC number is on the plan so you can look them up in eight seconds.',
  },
  {
    q: 'How do I know if aligners are right for me?',
    a: 'Book a free consultation. A dentist takes a 3D scan in person and tells you honestly whether aligners will work for you — and if they won’t, you pay nothing.',
  },
  {
    q: 'How much does MOVES cost?',
    a: 'Every package is published in full before you give us so much as an email address. Clear aligners start from £16.30 per month.',
  },
  {
    q: 'How long does treatment take?',
    a: 'Most moves take four to six months. Your exact timeline is shown on your signed plan, stage by stage, before you pay a pound.',
  },
  {
    q: 'Do I need clinic appointments?',
    a: 'You’re examined, scanned and fitted in person at the start. After that your aligners are delivered to your door and check-ins reach you before you have to ask.',
  },
  {
    q: 'Are MOVES aligners painful?',
    a: 'Expect mild pressure for a day or two each time you move to a new stage — that’s the teeth moving. It settles quickly and most people adjust within a week.',
  },
  {
    q: 'What happens while I’m wearing aligners?',
    a: 'Wear each set around 22 hours a day, taking them out to eat and clean your teeth, and swap to the next stage on schedule. We check in with you along the way.',
  },
  {
    q: 'How do I start?',
    a: 'Book a free consultation. Scan day takes about twenty minutes in person with a dentist — that’s the whole first move.',
  },
];

export function Faqs({ data }: { data?: FaqsData }) {
  const [open, setOpen] = useState<number | null>(0);

  const items = data?.items?.length
    ? data.items.map((it) => ({ q: it.question ?? '', a: it.answer ?? '' }))
    : FAQS;

  return (
    <section className="card-section faqs">
      <div className="faqs__head">
        <p className="eyebrow">{data?.eyebrow ?? 'FAQS'}</p>
        <h2 className="faqs__title">
          {data?.heading?.accent ?? 'Frequently'}{' '}
          <span className="ink">{data?.heading?.rest ?? 'asked questions'}</span>
        </h2>
        {data?.description ? <p className="faqs__desc">{data.description}</p> : null}
        {data?.cta ? (
          <a className="btn faqs__cta" href={data.cta.href ?? '#'}>
            {data.cta.label ?? 'Book Free Consultation'}
          </a>
        ) : null}
      </div>

      <div className="faqs__list">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div className={`faq${isOpen ? ' faq--open' : ''}`} key={i}>
              <button
                type="button"
                className="faq__q"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-btn-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden="true">
                  <Plus />
                </span>
              </button>
              <div
                className="faq__panel"
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
              >
                <p className="faq__answer">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
