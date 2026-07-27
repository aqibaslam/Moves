import { Caveat, Jost, Hanken_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Fonts for the Moves Dental landing page, matching the Figma file.
 *
 * - Jost      → all display headings (48/68/72px)
 * - Silka     → body + UI. Silka is a commercial font not on Google Fonts;
 *               Hanken Grotesk is the closest free geometric-grotesque match.
 *               Swap to a real Silka @font-face if a licence is available.
 * - Aeonik    → self-hosted, used only for the "Excellent (3,890)" bold label
 * - Caveat    → the "Amelia Hart" handwritten signature
 */

export const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-jost',
});

export const silka = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-silka',
});

export const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-caveat',
});

export const aeonik = localFont({
  src: [
    { path: '../../public/fonts/Aeonik-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Aeonik-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Aeonik-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Aeonik-Black.ttf', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-aeonik',
});
