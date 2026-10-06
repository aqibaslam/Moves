import type { Metadata } from 'next';
import { ResultsALander } from '@/components/campaign/ResultsALander';

export const metadata: Metadata = {
  title: 'MOVES Clear Aligners — Make your Move.',
  description:
    'Clear aligners planned in person and signed by a dentist you can name. Published prices, whitening and retainers included.',
};

export default function ClearAlignersResultsAPage() {
  return <ResultsALander trackingVariant="results-a" />;
}
