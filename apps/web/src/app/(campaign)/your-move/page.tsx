import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { Questrial } from 'next/font/google';

const questrial = Questrial({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-mp-questrial',
});

export const metadata: Metadata = {
  title: 'Your Move — MOVES Clear Aligners',
  description:
    "London's newest aligner brand. Every plan signed by a dentist. Book a free online consultation with MOVES.",
};

/**
 * Built against the Figma file "Move Ads - Landing Page" (node 1:2078),
 * section by section — see public/your-move-ads/markup.html and
 * styles.css. Static markup (not a component tree) to match the house
 * pattern already used for the other ad-traffic page, /book.
 *
 * Progress: header + hero done. Remaining sections (marquee, First
 * Movers, video reviews, how it works, comparison, prices, FAQ, final
 * CTA, footer) land in follow-up commits on this branch.
 */
const markup = fs.readFileSync(
  path.join(process.cwd(), 'public', 'your-move-ads', 'markup.html'),
  'utf8',
);

export default function YourMovePage() {
  return (
    <>
      <link rel="stylesheet" href="/your-move-ads/styles.css" />
      <main
        id="main"
        className={`${questrial.variable} mp-ads-page`}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </>
  );
}
