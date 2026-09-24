import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal/LegalPage';
import { TERMS_OF_SERVICE } from '@/components/legal/legal-content';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The rules for using the MOVES website, booking consultations and receiving clear aligner treatment through MOVES.',
};

/** Terms of Service — Figma "New Moves Dental 2.0" node 1824:5838. */
export default function TermsPage() {
  return <LegalPage doc={TERMS_OF_SERVICE} />;
}
