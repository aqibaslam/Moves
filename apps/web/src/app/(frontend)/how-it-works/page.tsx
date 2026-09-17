import '../landing/landing.css';
import '../landing-2026/landing-2026.css';
import '../funnel.css';
import '../funnel-2026/funnel-2026.css';
import '../clear-aligners/clear-aligners.css';
import './how-it-works.css';

import type { Metadata } from 'next';

import { getSiteData } from '@/lib/cms';
import { BOOKING_PATH } from '@/lib/booking/links';

import { Header, type HeaderData } from '@/components/landing/Header';
import { Marquee, type MarqueeData } from '@/components/landing/Marquee';
import { Reviews2 } from '@/components/landing/Reviews2';
import { Faqs, type FaqsData } from '@/components/landing/Faqs';
import { Problem, type ProblemData } from '@/components/landing/Problem';
import { FooterDark } from '@/components/landing2026/FooterDark';
import { LandingReveal } from '@/components/landing2026/LandingReveal';

import { HiwHero } from '@/components/hiw2026/HiwHero';
import { HiwTimeline } from '@/components/hiw2026/HiwTimeline';
import { HiwTreat } from '@/components/hiw2026/HiwTreat';
import { HiwStatement } from '@/components/hiw2026/HiwStatement';

export const metadata: Metadata = {
  title: 'How it works · Moves',
  description:
    'From your first smile assessment to your final results — how a MOVES clear-aligner journey works, step by step.',
};

export const dynamic = 'force-dynamic';

/** How it works — 2026 (Figma node 984:10311). Reuses the 2026 design system
 *  (.lp26/.ca26) and the shared Problem / Reviews2 / Faqs / FooterDark sections;
 *  `.hiw26` scopes the page-specific hero, timeline, treat and statement blocks. */
export default async function HowItWorks() {
  const site = await getSiteData();
  return (
    <div className="moves-page landing-2 lp26 ca26 hiw26">
      <div className="hero-unit lp26-hu">
        <Header data={site.header as HeaderData} logoSrc="/images/lp26-logo.png" />
        <HiwHero />
      </div>

      <Problem
        data={{
          eyebrow: '',
          heading: {
            rest: 'You’ve been making moves for years. Just the wrong',
            accent: ' ones.',
          },
          items: [
            { text: 'Closed-mouth photo' },
            { text: 'Hand over your mouth, mid-laugh' },
            { text: 'Turn away from the camera' },
            { text: 'Photo you took, then deleted.' },
            { text: '“Careful” smile.' },
            { text: 'Camera off, again.' },
          ],
          note: 'Small moves, all of them. MOVES exists for the big one.',
        }}
      />

      <HiwTimeline />

      <HiwTreat />

      <HiwStatement data={site.marquee as MarqueeData} />

      <Reviews2 />

      <Faqs
        data={{
          ...(site.faqs as FaqsData),
          eyebrow: '',
          heading: { accent: 'Frequently asked', rest: 'questions' },
          description:
            'Here are some of the most common questions about MOVES, answered by our experts to help you make an informed decision.',
          cta: { label: 'Book Free Consultation', href: BOOKING_PATH },
        }}
      />

      <FooterDark />

      <LandingReveal />
    </div>
  );
}
