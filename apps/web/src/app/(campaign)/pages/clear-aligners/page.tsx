import type { Metadata } from 'next';
import { ResultsALander } from '@/components/campaign/ResultsALander';

export const metadata: Metadata = {
  title: 'MOVES Clear Aligners — Make your Move.',
  description:
    'Clear aligners planned in person and signed by a dentist you can name. Published prices, whitening and retainers included.',
  alternates: { canonical: '/pages/clear-aligners' },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-image-preview': 'none',
      'max-snippet': 0,
    },
  },
};

export default function MetaClearAlignersPage() {
  return <ResultsALander trackingVariant="meta-clear-aligners-a" />;
}
