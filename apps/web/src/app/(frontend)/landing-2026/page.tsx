import '../landing/landing.css';
import './landing-2026.css';

import type { Metadata } from 'next';

import { getSiteData } from '@/lib/cms';

// Shared 2.0 building blocks (already designed)
import { Header, type HeaderData } from '@/components/landing/Header';
import { Marquee, type MarqueeData } from '@/components/landing/Marquee';
import { Reviews2 } from '@/components/landing/Reviews2';
import { Problem, type ProblemData } from '@/components/landing/Problem';
import { Pricing, type PricingData } from '@/components/landing/Pricing';
import { ProofInMotion, type ProofData } from '@/components/landing/ProofInMotion';
import { Faqs, type FaqsData } from '@/components/landing/Faqs';

// New 2026 sections
import { HeroBig } from '@/components/landing2026/HeroBig';
import { NotAligner } from '@/components/landing2026/NotAligner';
import { MoveAlone } from '@/components/landing2026/MoveAlone';
import { DentistNames } from '@/components/landing2026/DentistNames';
import { SmileInMotion } from '@/components/landing2026/SmileInMotion';
import { FooterDark } from '@/components/landing2026/FooterDark';

export const metadata: Metadata = {
  title: 'Making moves towards your perfect smile',
  description:
    'Clear aligners planned in person and signed by a named, GDC-registered dentist. Prices published.',
};

export const dynamic = 'force-dynamic';

/**
 * Home Page — 2026 (Figma node 413:9263). Reuses the already-designed 2.0
 * sections (Reviews2, Problem, Pricing, ProofInMotion, Faqs) and adds the new
 * sections from the frame. Scoped under `.lp26` (plus `.landing-2` so the
 * shared 2.0 styling applies) — no other page is affected.
 */
export default async function Home2026() {
  const site = await getSiteData();
  return (
    <div className="moves-page landing-2 lp26">
      <div className="hero-unit lp26-hu">
        <Header data={site.header as HeaderData} logoSrc="/images/lp26-logo.png" />
        <div className="lp26-hero-frame">
          <HeroBig />
        </div>
      </div>

      <Marquee data={site.marquee as MarqueeData} />
      <Reviews2 />
      <Problem
        data={{
          ...(site.problem as ProblemData),
          heading: {
            rest: 'Your’ve been making moves for years. Just the wrong',
            accent: ' ones.',
          },
        }}
      />
      <NotAligner />
      <Pricing
        accentLast
        solidCheck
        data={{
          ...(site.pricing as PricingData),
          // Figma 2026: title-case heading, only "Costs" in coral (accent last),
          // no "PRICING" eyebrow (hidden via CSS), and the published-pricing blurb.
          heading: { rest: 'Exactly What Moves', accent: 'Costs' },
          subtext:
            'Some brands make you book a call to learn a price. Ours are published. Every package, in full, before you’ve given us so much as an email address. That’s it. That’s the section.',
        }}
      />
      <MoveAlone />
      <DentistNames />
      <ProofInMotion data={site.proof as ProofData} />
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
    </div>
  );
}
