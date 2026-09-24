import '../funnel.css';
import './funnel-2026.css';

import type { Metadata } from 'next';

// NEW funnel sections
import { FunnelHero } from '@/components/funnel/FunnelHero';
import { CoralBand } from '@/components/funnel/CoralBand';
import { FunnelPricing, MOVES_TIERS } from '@/components/funnel/FunnelPricing';
import { Comparison } from '@/components/funnel/Comparison';
import { Candidacy } from '@/components/funnel/Candidacy';
import { ThreeMoves } from '@/components/landing/ThreeMoves';
import { WhatsIncluded } from '@/components/funnel2026/WhatsIncluded';
import { FunnelReveal } from '@/components/funnel2026/FunnelReveal';

// Reused landing sections (render their built-in fallback content)
import { BeforeAfters } from '@/components/landing/BeforeAfters';
import { CtaBanner } from '@/components/landing/CtaBanner';
import { Faqs } from '@/components/landing/Faqs';
import { FunnelFooter } from '@/components/funnel2026/FunnelFooter';
import { BOOKING_PATH } from '@/lib/booking/links';

export const metadata: Metadata = {
  title: 'Save over 85% on your first month',
  description:
    'Clear aligners planned in person and signed by a named, GDC-registered dentist. Prices published, from £895.',
};

/**
 * Funnel 2026 — a clone of /funnel with the new-branding colour scheme + type
 * system (New Moves Dental 2.0). The `funnel-2026` class on the wrapper scopes
 * every rebrand override to this page; /funnel and /funnel-ads are untouched.
 */
export default function Funnel2026Page() {
  return (
    <div className="moves-page funnel-page funnel-2026">
      <FunnelHero
        logoSrc="/images/moves-logo-2026.png"
        navCta={{ label: 'Book A Consultation' }}
      />
      <BeforeAfters />
      <CoralBand variant="2026" />
      <FunnelPricing tiers={MOVES_TIERS} movesCaps hideTreatment />
      <ThreeMoves data={{ heading: { pre: 'You move, in three', accent: 'moves' } }} />
      <Comparison logoSrc="/images/funnel-cmp-moves.svg" />
      <Candidacy />
      <WhatsIncluded />
      <CtaBanner
        data={{
          heading: { rest: 'Your smile. ', accent: 'Our signature.' },
          subtext:
            'Get the smile you’ve always wanted with a clear aligner treatment tailored to your needs.',
        }}
      />
      <Faqs
        data={{
          heading: { accent: 'Frequently asked', rest: 'questions' },
          description:
            'Find answers to common questions about MOVES, answered by our experts.',
          cta: { label: 'Book Free Consultation', href: BOOKING_PATH },
          items: [
            {
              question: 'What is MOVES?',
              answer:
                'MOVES is a modern clear aligner treatment designed to help you achieve a more confident smile without disrupting your everyday life. Your personalised aligners are created using advanced digital technology and guided by experienced dental professionals from start to finish.',
            },
            {
              question: 'Who signs my treatment plan?',
              answer:
                'Every MOVES treatment plan is reviewed and approved by a qualified dental professional. Your journey is overseen by our network of MOVES Verified Dentists, ensuring your treatment is safe, personalised, and clinically guided.',
            },
            {
              question: 'How do I know if aligners are right for me?',
              answer:
                'During your consultation, we’ll assess your smile goals and dental needs to determine whether clear aligners are the right option for you. MOVES can help with many common concerns, including crowded teeth, gaps, and mild to moderate alignment issues.',
            },
            {
              question: 'How long does treatment take?',
              answer:
                'Treatment time depends on your individual smile and the movement required. Many MOVES patients complete their treatment within a few months, while more complex cases may take longer. Your dentist will provide a personalised timeline during your consultation.',
            },
            {
              question: 'Do I need clinic appointments?',
              answer:
                'MOVES is designed to fit around your lifestyle. After your initial assessment, your progress can be monitored digitally, reducing the need for frequent clinic visits while still keeping you connected with your dental team.',
            },
            {
              question: 'Are MOVES aligners painful?',
              answer:
                'You may feel some pressure or mild discomfort when starting a new set of aligners. This is completely normal and usually means your aligners are gently moving your teeth into position. Most patients quickly adapt within a few days.',
            },
            {
              question: 'What happens while I’m wearing aligners?',
              answer:
                'Your aligners are made to fit comfortably into your daily routine. You can remove them when eating, drinking, brushing, and flossing. For the best results, we recommend wearing them for around 20–22 hours per day as advised by your dental professional.',
            },
            {
              question: 'How do I start?',
              answer:
                'Starting your MOVES journey is simple. Book your consultation, share your smile goals, and our dental team will guide you through your personalised treatment plan. Once approved, your custom aligners will be created and your transformation begins.',
            },
          ],
        }}
      />
      <FunnelFooter />
      {/* drives the scroll-reveal entrance of each section above (client-only) */}
      <FunnelReveal />
    </div>
  );
}
