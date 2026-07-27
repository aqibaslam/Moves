import { Hero } from '@/components/landing/Hero';
import { Problem } from '@/components/landing/Problem';
import { Manifesto } from '@/components/landing/Manifesto';
import { Marquee } from '@/components/landing/Marquee';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { BeforeAfters } from '@/components/landing/BeforeAfters';
import { Pricing } from '@/components/landing/Pricing';
import { Reviews } from '@/components/landing/Reviews';
import { Team } from '@/components/landing/Team';
import { ProofInMotion } from '@/components/landing/ProofInMotion';
import { Movers } from '@/components/landing/Movers';
import { CtaBanner } from '@/components/landing/CtaBanner';
import { Faqs } from '@/components/landing/Faqs';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="moves-page">
      <Hero />
      <Problem />
      <Manifesto />
      <Marquee />
      <HowItWorks />
      <BeforeAfters />
      <Pricing />
      <Reviews />
      <Team />
      <ProofInMotion />
      <Movers />
      <CtaBanner />
      <Faqs />
      <Footer />
    </div>
  );
}
