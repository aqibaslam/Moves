import { getSiteData } from '@/lib/cms';
import { Header, type HeaderData } from '@/components/landing/Header';
import { Hero, type HeroData } from '@/components/landing/Hero';
import { Problem, type ProblemData } from '@/components/landing/Problem';
import { Manifesto, type ManifestoData } from '@/components/landing/Manifesto';
import { Marquee, type MarqueeData } from '@/components/landing/Marquee';
import { HowItWorks, type HowItWorksData } from '@/components/landing/HowItWorks';
import { BeforeAfters, type BeforeAftersData } from '@/components/landing/BeforeAfters';
import { Pricing, type PricingData } from '@/components/landing/Pricing';
import { Reviews, type ReviewsData } from '@/components/landing/Reviews';
import { Team, type TeamData } from '@/components/landing/Team';
import { ProofInMotion, type ProofData } from '@/components/landing/ProofInMotion';
import { Movers, type MoversData } from '@/components/landing/Movers';
import { CtaBanner, type CtaData } from '@/components/landing/CtaBanner';
import { Faqs, type FaqsData } from '@/components/landing/Faqs';
import { Footer, type FooterData } from '@/components/landing/Footer';

// Render per-request so CMS edits appear immediately. Switch to ISR
// (`export const revalidate = 60`) for production performance if desired.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const site = await getSiteData();
  return (
    <div className="moves-page">
      <div className="hero-unit">
        <Header data={site.header as HeaderData} />
        <Hero data={site.hero as HeroData} />
      </div>
      <Problem data={site.problem as ProblemData} />
      <Manifesto data={site.manifesto as ManifestoData} />
      <Marquee data={site.marquee as MarqueeData} />
      <HowItWorks data={site['how-it-works'] as HowItWorksData} />
      <BeforeAfters data={site['before-afters'] as BeforeAftersData} />
      <Pricing data={site.pricing as PricingData} />
      <Reviews data={site.reviews as ReviewsData} />
      <Team data={site.team as TeamData} />
      <ProofInMotion data={site.proof as ProofData} />
      <Movers data={site.movers as MoversData} />
      <CtaBanner data={site.cta as CtaData} />
      <Faqs data={site.faqs as FaqsData} />
      <Footer data={site.footer as FooterData} />
    </div>
  );
}
