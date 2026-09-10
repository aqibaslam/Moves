import '../landing/landing.css';
import '../landing-2026/landing-2026.css';
import '../funnel.css';
import '../funnel-2026/funnel-2026.css';
import './clear-aligners.css';

import type { Metadata } from 'next';

import { getSiteData } from '@/lib/cms';
import { BOOKING_PATH } from '@/lib/booking/links';

// Shared building blocks
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

// New clear-aligners sections
import { ClearHero } from '@/components/clear2026/ClearHero';
import { ClearAlignerCare } from '@/components/clear2026/ClearAlignerCare';
import { FreeAssessment } from '@/components/clear2026/FreeAssessment';
import { ClearComparison } from '@/components/clear2026/ClearComparison';

export const metadata: Metadata = {
  title: 'Clear aligners · Moves',
  description:
    'Clear aligners planned in person and signed by a named, GDC-registered dentist. Prices published.',
};

export const dynamic = 'force-dynamic';

/* Pricing tiers (Figma 413:17193). The three columns are identical apart from the
   title — same price, features, button — so they render as three matching cards. */
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

/** Clear aligners — 2026 (Figma node 413:16796). Reuses the 2026 design system
 *  (.lp26) sections and adds three page-specific ones (hero, care, assessment).
 *  The comparison table is the funnel component, kept in its own funnel scope. */
export default async function ClearAligners() {
  const site = await getSiteData();
  return (
    <div className="moves-page landing-2 lp26 ca26">
      <div className="hero-unit lp26-hu">
        <Header data={site.header as HeaderData} logoSrc="/images/lp26-logo.png" />
        <ClearHero />
      </div>

      <Marquee data={site.marquee as MarqueeData} />

      <ClearAlignerCare />
      {/* ThreeMoves — reuse the funnel-2026 design (its full styling is scoped to
          `.funnel-2026`), same isolation pattern as the comparison table below */}
      <div className="funnel-page funnel-2026">
        <ThreeMoves data={{ heading: { pre: 'You move, in three', accent: 'moves' } }} />
      </div>
      <Pricing
        accentLast
        solidCheck
        data={{
          ...(site.pricing as PricingData),
          plans: PRICING_PLANS,
          heading: { rest: 'Exactly what moves', accent: 'costs' },
          subtext:
            'Some brands make you book a call to learn a price. Ours are published. Every package, in full, before you’ve given us so much as an email address.',
        }}
      />
      <Reviews2 />
      <FreeAssessment />

      {/* comparison table — reuses funnel `.f-cmp` styling in its own funnel scope */}
      <div className="ca26-cmp funnel-page funnel-2026">
        <ClearComparison />
      </div>

      <DentistNames />
      <ProofInMotion data={{ heading: { accent: 'Real smiles, real', rest: 'stories' } }} />
      <Faqs
        data={{
          ...(site.faqs as FaqsData),
          heading: { accent: 'Frequently asked', rest: 'questions' },
          description:
            'Here are some of the most common questions about clear aligners, answered by our experts to help you make an informed decision.',
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
