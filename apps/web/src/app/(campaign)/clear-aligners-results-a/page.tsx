import type { Metadata } from 'next';
import Script from 'next/script';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const markup = readFileSync(join(process.cwd(), 'public', 'results-a', 'markup.html'), 'utf8');

export const metadata: Metadata = {
  title: 'MOVES Clear Aligners — Make your Move.',
  description:
    'Clear aligners planned in person and signed by a dentist you can name. Published prices, whitening and retainers included.',
};

export default function ClearAlignersResultsAPage() {
  return (
    <>
      <link rel="stylesheet" href="/results-a/styles.css?v=8" />
      <div
        className="results-a-page"
        // This is a reviewed, local snapshot of the approved reference markup.
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <Script src="/results-a/interactions.js?v=4" strategy="afterInteractive" />
    </>
  );
}
