import '../landing/landing.css';
import '../landing-2026/landing-2026.css';
import '../funnel.css';
import '../funnel-2026/funnel-2026.css';
import '../clear-aligners/clear-aligners.css';
import './composite-bonding.css';

import type { Metadata } from 'next';

import { getSiteData } from '@/lib/cms';
import { BOOKING_PATH } from '@/lib/booking/links';

// Shared building blocks (same sections as the clear-aligners page)
import { Header, type HeaderData } from '@/components/landing/Header';
import { Marquee, type MarqueeData } from '@/components/landing/Marquee';
import { Reviews2 } from '@/components/landing/Reviews2';
import { Pricing, type PricingData } from '@/components/landing/Pricing';
import { ProofInMotion } from '@/components/landing/ProofInMotion';
import { Faqs, type FaqsData } from '@/components/landing/Faqs';
import { ThreeMoves } from '@/components/landing/ThreeMoves';

import { DentistNames } from '@/components/landing2026/DentistNames';
import { SmileInMotion } from '@/components/landing2026/SmileInMotion';
import { FooterDark } from '@/components/landing2026/FooterDark';
import { LandingReveal } from '@/components/landing2026/LandingReveal';

// Clear-aligners sections reused directly
import { ClearComparison } from '@/components/clear2026/ClearComparison';

// Composite-bonding page-specific sections (clones of the clear-aligners designs)
import { CompositeHero } from '@/components/composite2026/CompositeHero';
import { CompositeCare } from '@/components/composite2026/CompositeCare';
import { CompositeAssessment } from '@/components/composite2026/CompositeAssessment';

export const metadata: Metadata = {
  title: 'Composite bonding · Moves',
  description:
    'Composite bonding planned and applied by a named, GDC-registered dentist. Custom shade matching, same-day results, prices published.',
};

export const dynamic = 'force-dynamic';

/* Pricing tiers (Figma 984:7814) — same three matching cards as the clear-aligners
   page: identical price, features and button, differing only by title. */
const PRICING_PLANS: NonNullable<PricingData['plans']> = ['Mild', 'Moderate', 'Composite Bonding'].map(
  (title) => ({
    title,
    price: '£16.30',
    per: '/per month',
    features: [
      { text: 'Dual Arch' },
      { text: '4—6 months treatment time' },
      { text: 'Crowding on 6-8 teeth' },
      { text: 'Bite correction' },
    ],
    buttonLabel: 'Book Free Consultation',
    variant: 'navy',
  }),
);

/** Composite Bonding — 2026 (Figma node 984:7282). Reuses the 2026 design system
 *  (.lp26) and the clear-aligners section designs (.ca26); `.cb26` is the
 *  page-local hook for composite-bonding image overrides. */
export default async function CompositeBonding() {
  const site = await getSiteData();
  return (
    <div className="moves-page landing-2 lp26 ca26 cb26">
      <div className="hero-unit lp26-hu">
        <Header data={site.header as HeaderData} logoSrc="/images/lp26-logo.png" />
        <div className="lp26-hero-frame">
          <CompositeHero />
        </div>
      </div>

      <Marquee data={site.marquee as MarqueeData} />

      <CompositeCare />

      {/* ThreeMoves — reuse the funnel-2026 design (scoped to `.funnel-2026`) */}
      <div className="funnel-page funnel-2026">
        <ThreeMoves data={{ heading: { pre: 'You move, in three', accent: 'moves' } }} />
      </div>

      <Reviews2 />

      <Pricing
        accentLast
        solidCheck
        data={{
          ...(site.pricing as PricingData),
          plans: PRICING_PLANS,
          heading: { rest: 'Exactly what moves', accent: 'costs' },
          subtext:
            'Some brands make you book a call to learn a price. Ours are published. Every package, in full, before you’ve given us so much as an email address. That’s it. That’s the section.',
        }}
      />

      <CompositeAssessment />

      <DentistNames />

      {/* comparison table — reuses funnel `.f-cmp` styling in its own funnel scope */}
      <div className="ca26-cmp funnel-page funnel-2026">
        <ClearComparison />
      </div>

      <ProofInMotion data={{ heading: { accent: 'Real smiles, real', rest: 'stories' } }} />

      <Faqs
        data={{
          ...(site.faqs as FaqsData),
          heading: { accent: 'Frequently asked', rest: 'questions' },
          description:
            'Here are some of the most common questions about composite bonding, answered by our experts to help you make an informed decision.',
          cta: { label: 'Book Free Consultation', href: BOOKING_PATH },
        }}
      />

      <SmileInMotion />
      <FooterDark />

      {/* drives the scroll-reveal entrance of each section above (client-only) */}
      <LandingReveal />
    </div>
  );
}
