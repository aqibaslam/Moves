import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Public_Sans } from 'next/font/google';
import '@moves/design-tokens/css';
import './campaign.css';
import { MetaPixel } from '@/components/analytics/MetaPixel';

const display = localFont({
  src: '../../../public/fonts/GlacialIndifference-Regular.woff',
  weight: '400',
  display: 'swap',
  variable: '--font-moves-display',
});

const body = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-moves-body',
});

export const metadata: Metadata = {
  title: 'MOVES Clear Aligners — Make your Move.',
  description:
    'Clear aligners that fit into your life. Clinician-led care, from your first plan to your final smile. Book a free online consultation with MOVES.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body className="campaign-body">
        <MetaPixel />
        <a className="campaign-skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
