import Script from 'next/script';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const markup = readFileSync(join(process.cwd(), 'public', 'results-a', 'markup.html'), 'utf8');

type ResultsALanderProps = {
  trackingVariant: string;
};

/**
 * The approved paid lander, shared by its reference route and campaign URLs.
 * Keeping a single render source prevents visual and CRO fixes drifting between
 * otherwise identical pages while still giving each ad route its own attribution.
 */
export function ResultsALander({ trackingVariant }: ResultsALanderProps) {
  return (
    <>
      <link rel="stylesheet" href="/results-a/styles.css?v=21" />
      <div
        className="results-a-page"
        data-landing-page-variant={trackingVariant}
        // This is a reviewed, local snapshot of the approved reference markup.
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <Script src="/results-a/interactions.js?v=22" strategy="afterInteractive" />
    </>
  );
}
