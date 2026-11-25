import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Black Friday: £100 off every Move — MOVES Clear Aligners',
  description:
    'Black Friday: £100 off every Move until 30 Nov. Clear aligners, planned and signed off by a London dentist. Book a free video call with MOVES.',
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Ads landing page, Black Friday version (V4): built from the approved
 * "MOVES-Ads-Landing-Black-Friday" file, split into
 * public/landing-bf/{bf-markup.html,bf.css,bf.js}. Static markup (not a
 * component tree) to match the house pattern used by /book and /your-move.
 * The booking modal posts to /api/booking (GoHighLevel calendar) and the
 * email popup to /api/lead (GoHighLevel contact + tags).
 *
 * Publicly reachable without the review password: see isGateExempt in
 * src/proxy.ts. Display + body fonts come from the (campaign) layout.
 */
export default function AlignerLanderPage() {
  const markup = fs.readFileSync(
    path.join(process.cwd(), 'public', 'landing-bf', 'bf-markup.html'),
    'utf8',
  );
  return (
    <>
      <link rel="stylesheet" href="/landing-bf/bf.css" />
      {/* Hero images are the LCP: fetch them as early as possible. */}
      <link rel="preload" as="image" href="/landing-bf/img/9ee58dbc0c.webp" media="(min-width: 761px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/landing-bf/img/hero-woman.webp" media="(min-width: 761px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/landing-bf/img/ae38864696.webp" media="(max-width: 760px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/landing-bf/img/hero-woman-m.webp" media="(max-width: 760px)" fetchPriority="high" />
      <link rel="stylesheet" href="/video-slider/video-slider.css" />
      <div id="main" className="bf-root" dangerouslySetInnerHTML={{ __html: markup }} />
      <Script src="/landing-bf/bf.js" strategy="afterInteractive" />
      <Script src="/video-slider/video-slider.js" strategy="afterInteractive" />
    </>
  );
}
