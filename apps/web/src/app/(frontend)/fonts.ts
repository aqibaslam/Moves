import { Caveat, DM_Sans, Inter, Jost, Public_Sans } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Fonts for the Moves Dental landing page, matching the Figma file.
 *
 * - Jost      → all display headings (48/68/72px)
 * - Silka     → body + UI. Self-hosted (licensed .ttf) at three weights:
 *               400 (regular), 500 (medium), 700 (bold).
 * - Aeonik    → self-hosted, used only for the "Excellent (3,890)" bold label
 * - Caveat    → the "Amelia Hart" handwritten signature
 */

export const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-jost',
});

export const silka = localFont({
  src: [
    { path: '../../../public/fonts/Silka-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/Silka-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../../public/fonts/Silka-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-silka',
});

export const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-caveat',
});

// Inter — used for the 2.0 pricing card titles (Figma).
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// DM Sans — footer social-button labels (Figma).
export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-dm-sans',
});

// Public Sans — body + UI text on the 2026 funnel (Figma "New Moves Dental 2.0").
export const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-public-sans',
});

// Glacial Indifference — all display headings on the 2026 funnel (Figma).
// Not on Google Fonts; self-hosted (free for commercial use).
export const glacialIndifference = localFont({
  src: [
    { path: '../../../public/fonts/GlacialIndifference-Regular.woff', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/GlacialIndifference-Bold.woff', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-glacial',
});

export const aeonik = localFont({
  src: [
    { path: '../../../public/fonts/Aeonik-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/Aeonik-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../../public/fonts/Aeonik-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../../public/fonts/Aeonik-Black.ttf', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-aeonik',
});
