import '../landing/landing.css';
import '../landing-2026/landing-2026.css';
import './about-us.css';

import type { Metadata } from 'next';

import { getSiteData } from '@/lib/cms';

// Shared 2.0 / 2026 building blocks
import { Header, type HeaderData } from '@/components/landing/Header';
import { Reviews2 } from '@/components/landing/Reviews2';
import { Faqs, type FaqsData } from '@/components/landing/Faqs';
import { DentistNames } from '@/components/landing2026/DentistNames';
import { FooterDark } from '@/components/landing2026/FooterDark';

// New About sections
import { AboutHero } from '@/components/about2026/AboutHero';
import { WhoWeAre } from '@/components/about2026/WhoWeAre';
import { MovesStatement } from '@/components/about2026/MovesStatement';
import { YourJourney } from '@/components/about2026/YourJourney';

export const metadata: Metadata = {
  title: 'About us · Moves',
  description:
    'MOVES is more than clear aligners — it is the care behind smiles that finally feel free. Meet the team behind the movement.',
};

export const dynamic = 'force-dynamic';

/** About Us — 2026 (Figma node 541:1588). Reuses the 2026 design system (.lp26)
 *  so the shared sections (Before & Afters, dentists, FAQ, footer) match. */
export default async function AboutUs() {
  const site = await getSiteData();
  return (
    <div className="moves-page landing-2 lp26 about26">
      <div className="hero-unit lp26-hu">
        <Header data={site.header as HeaderData} logoSrc="/images/lp26-logo.png" />
        <AboutHero />
      </div>

      <WhoWeAre />
      <Reviews2 />
      <MovesStatement />
      <YourJourney />
      <DentistNames />
      <Faqs
        data={{
          ...(site.faqs as FaqsData),
          heading: { accent: 'Frequently asked', rest: 'questions' },
          description:
            'Here are some of the most common questions about full mouth implants, answered by our experts to help you make an informed decision.',
          cta: { label: 'Book Free Consultation' },
        }}
      />
      <FooterDark />
    </div>
  );
}
