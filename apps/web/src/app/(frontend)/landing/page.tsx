import './landing.css';

import type { Metadata } from 'next';

import { getSiteData } from '@/lib/cms';
import { Header, type HeaderData } from '@/components/landing/Header';
import { Hero2 } from '@/components/landing/Hero2';
import { Marquee, type MarqueeData } from '@/components/landing/Marquee';
import { Reviews2 } from '@/components/landing/Reviews2';
import { Problem, type ProblemData } from '@/components/landing/Problem';
import { OneMoment } from '@/components/landing/OneMoment';
import { ThreeMoves } from '@/components/landing/ThreeMoves';
import { Pricing, type PricingData } from '@/components/landing/Pricing';
import { ProofInMotion, type ProofData } from '@/components/landing/ProofInMotion';
import { Team, type TeamData } from '@/components/landing/Team';
import { Faqs, type FaqsData } from '@/components/landing/Faqs';
import { CtaBanner, type CtaData } from '@/components/landing/CtaBanner';
import { Footer, type FooterData } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Making moves towards your perfect smile',
  description:
    'Clear aligners planned in person and signed by a named, GDC-registered dentist. Prices published.',
};

export const dynamic = 'force-dynamic';

/**
 * Landing Page — "New Moves Dental 2.0" (Figma). Same building blocks as the
 * home page, reordered to the 2.0 flow and dropping Before/Afters + Movers.
 * Sections are refined section-by-section against the Figma frame.
 */
export default async function LandingPage() {
  const site = await getSiteData();
  return (
    <div className="moves-page landing-2">
      <div className="hero-unit">
        <Header data={site.header as HeaderData} />
        <Hero2 />
      </div>
      <Marquee data={site.marquee as MarqueeData} />
      <Reviews2 />
      <Problem
        data={{
          ...(site.problem as ProblemData),
          // 2.0 design: coral accent on the opening phrase, navy remainder.
          heading: { lead: 'Your’ve been making', rest: ' moves for years. Just the wrong ones.' },
        }}
      />
      <OneMoment />
      <ThreeMoves />
      <Pricing data={site.pricing as PricingData} />
      <ProofInMotion data={site.proof as ProofData} />
      <Team data={site.team as TeamData} variant="stacked" />
      <Faqs data={site.faqs as FaqsData} />
      <CtaBanner
        variant="v2"
        data={{
          ...(site.cta as CtaData),
          title: 'Your move',
          subtext:
            'Get the smile you’ve always wanted with a clear aligner treatment tailored to your needs.',
        }}
      />
      <Footer data={site.footer as FooterData} variant="v2" />
    </div>
  );
}
