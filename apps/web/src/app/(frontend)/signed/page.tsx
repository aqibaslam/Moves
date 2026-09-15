import '../landing/landing.css';
import '../landing-2026/landing-2026.css';
import '../funnel.css';
import '../funnel-2026/funnel-2026.css';
import '../clear-aligners/clear-aligners.css';
import './signed.css';

import type { Metadata } from 'next';

import { getSiteData } from '@/lib/cms';
import { BOOKING_PATH } from '@/lib/booking/links';

import { Header, type HeaderData } from '@/components/landing/Header';
import { Marquee, type MarqueeData } from '@/components/landing/Marquee';
import { Faqs, type FaqsData } from '@/components/landing/Faqs';
import { Problem, type ProblemData } from '@/components/landing/Problem';
import { DentistNames } from '@/components/landing2026/DentistNames';
import { FooterDark } from '@/components/landing2026/FooterDark';
import { LandingReveal } from '@/components/landing2026/LandingReveal';

import { SignedHero } from '@/components/signed2026/SignedHero';
import { SignedStatement } from '@/components/signed2026/SignedStatement';
import { SignedPerson } from '@/components/signed2026/SignedPerson';
import { SignedStandard } from '@/components/signed2026/SignedStandard';
import { SignedAnonymous } from '@/components/signed2026/SignedAnonymous';

export const metadata: Metadata = {
  title: 'Signed · Moves',
  description:
    'Every MOVES smile is signed by a named, GDC-registered dentist who assesses you, signs your plan and owns your aftercare.',
};

export const dynamic = 'force-dynamic';

/** Signed — 2026 (Figma node 984:18363). Reuses the 2026 design system (.lp26) and
 *  the clear-aligners hero/care designs (.ca26); `.sg26` is the page-local hook. */
export default async function Signed() {
  const site = await getSiteData();
  return (
    <div className="moves-page landing-2 lp26 ca26 sg26">
      <div className="hero-unit lp26-hu">
        <Header data={site.header as HeaderData} logoSrc="/images/lp26-logo.png" />
        <div className="lp26-hero-frame">
          <SignedHero />
        </div>
      </div>

      <SignedStatement />

      <Marquee data={site.marquee as MarqueeData} />

      <SignedPerson />

      <SignedStandard />

      <SignedAnonymous />

      <Problem
        data={{
          ...(site.problem as ProblemData),
          heading: {
            rest: 'You’ve been making moves for years. Just the wrong',
            accent: ' ones.',
          },
        }}
      />

      <DentistNames />

      <Faqs
        data={{
          ...(site.faqs as FaqsData),
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
