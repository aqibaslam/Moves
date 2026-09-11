import '../landing/landing.css';
import '../landing-2026/landing-2026.css';
import './results.css';

import type { Metadata } from 'next';

import { getSiteData } from '@/lib/cms';

// Shared 2.0 / 2026 building blocks (already designed on landing-2026 + funnel-2026)
import { Header, type HeaderData } from '@/components/landing/Header';
import { Marquee, type MarqueeData } from '@/components/landing/Marquee';
import { Reviews2 } from '@/components/landing/Reviews2';
import { ProofInMotion } from '@/components/landing/ProofInMotion';
import { Faqs, type FaqsData } from '@/components/landing/Faqs';
import { ResultsHero } from '@/components/results2026/ResultsHero';
import { SmileInMotion } from '@/components/landing2026/SmileInMotion';
import { FooterDark } from '@/components/landing2026/FooterDark';
import { LandingReveal } from '@/components/landing2026/LandingReveal';

export const metadata: Metadata = {
  title: 'Results · See what a MOVES smile can look like',
  description:
    'Real MOVES smiles — every case examined in person, planned and signed by a named, GDC-registered dentist.',
};

export const dynamic = 'force-dynamic';

/**
 * Results — 2026 (Figma node 984:13404). Assembled from the already-designed
 * 2026 sections: hero, marquee, "Real moves. Signed." (BeforeAfters), the video
 * proof section, FAQs and the dark footer. Scoped under `.lp26` (+ `.landing-2`)
 * so the shared rebrand styling applies; `.results26` is the page-local hook.
 */
export default async function Results() {
  const site = await getSiteData();
  return (
    <div className="moves-page landing-2 lp26 results26">
      <div className="hero-unit lp26-hu">
        <Header data={site.header as HeaderData} logoSrc="/images/lp26-logo.png" />
        <div className="lp26-hero-frame">
          <ResultsHero />
        </div>
      </div>

      <Marquee data={site.marquee as MarqueeData} />

      {/* Real moves. Signed. — the landing-2026 before/after carousel (Reviews2) */}
      <Reviews2 />

      {/* Video proof — "Real smiles, real stories" */}
      <ProofInMotion data={{ heading: { accent: 'Real smiles, real', rest: 'stories' } }} />

      <Faqs
        data={{
          ...(site.faqs as FaqsData),
          heading: { accent: 'Frequently asked', rest: 'questions' },
          description:
            'Here are some of the most common questions about clear aligners, answered by our experts to help you make an informed decision.',
          cta: { label: 'Book Free Consultation' },
        }}
      />

      {/* Your smile. In motion. — testimonial over full-bleed video (landing-2026) */}
      <SmileInMotion />

      <FooterDark />

      {/* drives the scroll-reveal entrance of each section above (client-only) */}
      <LandingReveal />
    </div>
  );
}
