import '../landing/landing.css';
import '../landing-2026/landing-2026.css';
import '../funnel.css';
import '../funnel-2026/funnel-2026.css';
import '../clear-aligners/clear-aligners.css';
import './pricing.css';

import type { Metadata } from 'next';

import { getSiteData } from '@/lib/cms';

// Shared 2026 building blocks
import { Header, type HeaderData } from '@/components/landing/Header';
import { Marquee, type MarqueeData } from '@/components/landing/Marquee';
import { Faqs, type FaqsData } from '@/components/landing/Faqs';
import { ClearComparison } from '@/components/clear2026/ClearComparison';
import { SmileInMotion } from '@/components/landing2026/SmileInMotion';
import { FooterDark } from '@/components/landing2026/FooterDark';
import { LandingReveal } from '@/components/landing2026/LandingReveal';

// New pricing sections
import { PricingHero } from '@/components/pricing2026/PricingHero';
import { PricingPlans } from '@/components/pricing2026/PricingPlans';
import { PackageIncludes } from '@/components/pricing2026/PackageIncludes';
import { FinancePlans } from '@/components/pricing2026/FinancePlans';

export const metadata: Metadata = {
  title: 'Pricing · Moves',
  description:
    'Exactly what MOVES costs — prices published upfront, packages from £895, monthly plans available, dentist-led treatment included.',
};

export const dynamic = 'force-dynamic';

/** MOVES Pricing — 2026 (Figma node 984:10947). Reuses the 2026 design system
 *  (.lp26 + .ca26 hero/comparison scoping) and adds the pricing-specific
 *  sections. `.pricing26` is the page-local hook. */
export default async function Pricing() {
  const site = await getSiteData();
  return (
    <div className="moves-page landing-2 lp26 ca26 pricing26">
      <div className="hero-unit lp26-hu">
        <Header data={site.header as HeaderData} logoSrc="/images/lp26-logo.png" />
        <div className="lp26-hero-frame">
          <PricingHero />
        </div>
      </div>

      <Marquee data={site.marquee as MarqueeData} />

      <PricingPlans />

      {/* comparison table — reuses funnel `.f-cmp` styling in its own funnel scope */}
      <div className="ca26-cmp funnel-page funnel-2026">
        <ClearComparison />
      </div>

      <PackageIncludes />

      <FinancePlans />

      <Faqs
        data={{
          ...(site.faqs as FaqsData),
          heading: { accent: 'Frequently asked', rest: 'questions' },
          description:
            'Here are some of the most common questions about clear aligners, answered by our experts to help you make an informed decision.',
          cta: { label: 'Book Free Consultation' },
        }}
      />

      <SmileInMotion />
      <FooterDark />

      {/* drives the scroll-reveal entrance of each section above (client-only) */}
      <LandingReveal />
    </div>
  );
}
