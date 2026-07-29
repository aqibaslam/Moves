import '../funnel.css';

import type { Metadata } from 'next';

// NEW funnel sections
import { FunnelHero } from '@/components/funnel/FunnelHero';
import { CoralBand } from '@/components/funnel/CoralBand';
import { FunnelPricing } from '@/components/funnel/FunnelPricing';
import { Comparison } from '@/components/funnel/Comparison';
import { Process } from '@/components/funnel/Process';
import { Candidacy } from '@/components/funnel/Candidacy';
import { SignatureCta } from '@/components/funnel/SignatureCta';
import { YourMoveBand } from '@/components/funnel/YourMoveBand';

// Reused landing sections (render their built-in fallback content)
import { BeforeAfters } from '@/components/landing/BeforeAfters';
import { Marquee } from '@/components/landing/Marquee';
import { Team } from '@/components/landing/Team';
import { Reviews } from '@/components/landing/Reviews';
import { CtaBanner } from '@/components/landing/CtaBanner';
import { ProofInMotion } from '@/components/landing/ProofInMotion';
import { Faqs } from '@/components/landing/Faqs';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Save over 85% on your first month',
  description:
    'Clear aligners planned in person and signed by a named, GDC-registered dentist. Prices published, from £895.',
};

export default function FunnelPage() {
  return (
    <div className="moves-page funnel-page">
      <FunnelHero />
      <Marquee />
      <BeforeAfters />
      <CoralBand />
      <FunnelPricing />
      <Comparison />
      <Process />
      <Candidacy />
      <SignatureCta />
      <Team />
      <Reviews data={{ eyebrow: 'OUR CLIENTS' }} />
      <CtaBanner />
      <ProofInMotion />
      <Faqs />
      <YourMoveBand />
      <Footer />
    </div>
  );
}
