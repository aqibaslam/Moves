import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Make your Move — MOVES Clear Aligners',
  description:
    'Clear aligners, planned and signed off by a London dentist. Book a free video call with MOVES to see if they’re right for you.',
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Ads landing page, built against Figma "Move Ads - Landing Page 2.0"
 * (node 26:1066, desktop 1440 + mobile 390). Static markup (not a component
 * tree) to match the house pattern used by /book and /your-move — see
 * public/landing-ads/{markup.html,styles.css,interactions.js}.
 *
 * Publicly reachable without the review password: see isGateExempt in
 * src/proxy.ts. Display + body fonts come from the (campaign) layout.
 */
export default function LandingPage() {
  const markup = fs.readFileSync(
    path.join(process.cwd(), 'public', 'landing-ads', 'markup.html'),
    'utf8',
  );
  return (
    <>
      <link rel="stylesheet" href="/landing-ads/styles.css" />
      <main id="main" className="lp" dangerouslySetInnerHTML={{ __html: markup }} />
      <Script src="/landing-ads/interactions.js" strategy="afterInteractive" />
    </>
  );
}
