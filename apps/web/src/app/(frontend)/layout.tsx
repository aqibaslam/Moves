import type { Metadata, Viewport } from 'next';
import { aeonik, caveat, dmSans, inter, jost, silka } from './fonts';
import './globals.css';
import './moves.css';

export const metadata: Metadata = {
  title: {
    default: 'Moves — The movement behind modern smiles',
    template: '%s · Moves',
  },
  description:
    'MOVES is the movement behind modern smiles. Planned in person, signed by a named GDC-registered dentist, at a price we publish.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05143B',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${silka.variable} ${caveat.variable} ${aeonik.variable} ${inter.variable} ${dmSans.variable}`}
    >
      <body>
        <a href="#main" className="sr-only">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
