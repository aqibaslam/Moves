'use client';

import { useState } from 'react';
import { Check } from '@/components/landing/icons';
import { BOOKING_PATH } from '@/lib/booking/links';

interface Tier {
  title: string;
  accent: string; // title, price + top-border colour
  btnBg: string; // button fill
  monthly: string; // spread over 30 months @ 0% APR
  upfront: string; // one-off total
  best: string;
  treatment: string;
}

const TIERS: Tier[] = [
  {
    title: 'Mild',
    accent: '#004df6',
    btnBg: '#04143a',
    monthly: '£57',
    upfront: '£1,695',
    best: 'Best for: minor relapse: teeth that were straightened once and have drifted, or a single tooth out of place.',
    treatment: '4 months',
  },
  {
    title: 'Moderate',
    accent: '#04143a',
    btnBg: '#04143a',
    monthly: '£80',
    upfront: '£2,395',
    best: 'Best for: mild crowding, small gaps, or minor rotation.',
    treatment: '4-6 months',
  },
  {
    title: 'Advanced',
    accent: '#fc5257',
    btnBg: '#fc5257',
    monthly: '£100',
    upfront: '£2,985',
    best: 'Best for: noticeable crowding, gaps, or mild bite issues, with several teeth on the move.',
    treatment: '4-6 months',
  },
];

const INCLUDES = [
  'In-person dentist appointments (scan, fitting, finish)',
  'Mid-course corrections if your dentist calls for them',
  'Signed plan + digital preview of the movement',
  'Check-ins through treatment — we contact you first',
  'Every aligner in your plan, made in Germany',
];

const DECIDES = [
  'How far your teeth need to move',
  'How many teeth need to move',
  'Whether your bite needs correcting',
  'How long it will take',
];

type Mode = 'monthly' | 'upfront';

export function FunnelPricing() {
  const [mode, setMode] = useState<Mode>('upfront');

  return (
    <section className="card-section f-pricing" id="pricing">
      <div className="f-pricing__head">
        <div className="f-pricing__intro">
          <p className="eyebrow">PRICING</p>
          <h2 className="h-section">
            Exactly what moves <span className="c">costs</span>
          </h2>
          <p className="lead">
            Some brands make you book a call to learn a price. Ours are published. Every package, in
            full, before you&rsquo;ve given us so much as an email address. That&rsquo;s it.
            That&rsquo;s the section.
          </p>
        </div>

        {/* Pay monthly / Pay upfront toggle */}
        <div className="fp-toggle" role="tablist" aria-label="Payment mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'monthly'}
            className={`fp-toggle__opt${mode === 'monthly' ? ' fp-toggle__opt--active' : ''}`}
            onClick={() => setMode('monthly')}
          >
            Pay monthly
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'upfront'}
            className={`fp-toggle__opt${mode === 'upfront' ? ' fp-toggle__opt--active' : ''}`}
            onClick={() => setMode('upfront')}
          >
            Pay upfront
          </button>
        </div>

        <p className="f-pricing__note">
          [Spread the cost over up to 30 months at 0% APR representative, subject to status.]
        </p>
      </div>

      <div className="f-pricing__cards">
        {TIERS.map((t) => (
          <div className="fpcard" key={t.title} style={{ ['--tier' as string]: t.accent }}>
            <div className="fpcard__top">
              <h3 className="fpcard__title">{t.title}</h3>
              <div className="fpcard__pricerow">
                <div className="fpcard__pricecol">
                  <span className="fpcard__from">From</span>
                  <span className="fpcard__price">{mode === 'monthly' ? t.monthly : t.upfront}</span>
                </div>
                <span className="fpcard__per">{mode === 'monthly' ? '/per month' : '/One - time'}</span>
              </div>
              <p className="fpcard__best">{t.best}</p>
              <p className="fpcard__treat">Treatment time: {t.treatment}</p>
            </div>

            <a className="btn fpcard__btn" style={{ ['--btn-c' as string]: t.btnBg }} href={BOOKING_PATH}>
              Book Free Consultation
            </a>
          </div>
        ))}
      </div>

      <div className="f-includes">
        <div className="f-includes__col">
          <h3 className="f-includes__title">Every package includes</h3>
          <ul className="f-includes__list">
            {INCLUDES.map((i) => (
              <li className="f-includes__item" key={i}>
                <Check />
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="f-includes__col">
          <h3 className="f-includes__title">What decides your tier</h3>
          <ul className="f-includes__list">
            {DECIDES.map((d, i) => (
              <li className="f-includes__item" key={d}>
                <span className="f-includes__num">{String(i + 1).padStart(2, '0')}</span>
                {d}
              </li>
            ))}
          </ul>
          <p className="f-includes__foot">
            Your consultation gives you an estimate. Your dentist confirms it at your first
            appointment, after your scan, X-rays and health check. The price follows the clinical
            findings. Nothing else.
          </p>
        </div>
      </div>
    </section>
  );
}
