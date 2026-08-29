import '../funnel.css';
import './funnel-2026.css';

import type { Metadata } from 'next';

// NEW funnel sections
import { FunnelHero } from '@/components/funnel/FunnelHero';
import { CoralBand } from '@/components/funnel/CoralBand';
import { FunnelPricing } from '@/components/funnel/FunnelPricing';
import { Comparison } from '@/components/funnel/Comparison';
import { Candidacy } from '@/components/funnel/Candidacy';
import { ThreeMoves } from '@/components/landing/ThreeMoves';
import { WhatsIncluded } from '@/components/funnel2026/WhatsIncluded';
import { DentistNames } from '@/components/landing2026/DentistNames';

// Reused landing sections (render their built-in fallback content)
import { BeforeAfters } from '@/components/landing/BeforeAfters';
import { CtaBanner } from '@/components/landing/CtaBanner';
import { ProofInMotion } from '@/components/landing/ProofInMotion';
import { Faqs } from '@/components/landing/Faqs';
import { FooterDark } from '@/components/landing2026/FooterDark';

export const metadata: Metadata = {
  title: 'Save over 85% on your first month',
  description:
    'Clear aligners planned in person and signed by a named, GDC-registered dentist. Prices published, from £895.',
};

/**
 * Funnel 2026 — a clone of /funnel with the new-branding colour scheme + type
 * system (New Moves Dental 2.0). The `funnel-2026` class on the wrapper scopes
 * every rebrand override to this page; /funnel and /funnel-ads are untouched.
 */
export default function Funnel2026Page() {
  return (
    <div className="moves-page funnel-page funnel-2026">
      <FunnelHero />
      <BeforeAfters />
      <CoralBand variant="2026" />
      <FunnelPricing />
      <ThreeMoves />
      <Comparison />
      <Candidacy />
      <WhatsIncluded />
      <DentistNames />
      <ProofInMotion />
      <CtaBanner
        data={{
          heading: { rest: 'Your smile. ', accent: 'Our signature.' },
          subtext:
            'Get the smile you’ve always wanted with a clear aligner treatment tailored to your needs.',
        }}
      />
      <Faqs
        data={{
          heading: { accent: 'Frequently asked', rest: 'questions' },
          description:
            'Here are some of the most common questions about clear aligners, answered by our experts to help you make an informed decision.',
          cta: { label: 'Book Free Consultation' },
        }}
      />
      <FooterDark />
    </div>
  );
}
