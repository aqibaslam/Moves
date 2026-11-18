import type { Metadata } from 'next';
import { YourMoveHeader, YourMoveHero } from '@/components/your-move/YourMove';

export const metadata: Metadata = {
  title: 'Your Move — MOVES Clear Aligners',
  description:
    'Clear aligners with a personal plan and care from a named dentist. Book a free online consultation with MOVES.',
};

/**
 * Placeholder scaffold for the new aligner landing page. Sections will be
 * replaced section-by-section once the Figma is in hand — see
 * components/your-move/YourMove.tsx.
 */
export default function YourMovePage() {
  return (
    <>
      <YourMoveHeader />
      <YourMoveHero />
    </>
  );
}
