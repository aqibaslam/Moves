import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal/LegalPage';
import { PRIVACY_POLICY } from '@/components/legal/legal-content';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How MOVES collects, uses, stores and protects your personal and dental information when you use our website, book a consultation or receive treatment.',
};

/** Privacy Policy — Figma "New Moves Dental 2.0" node 1824:5838. */
export default function PrivacyPolicyPage() {
  return <LegalPage doc={PRIVACY_POLICY} />;
}
