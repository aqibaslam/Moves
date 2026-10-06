import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Script from 'next/script';

import { BookingBodyClass } from '@/components/booking/BookingBodyClass';

export const metadata: Metadata = {
  title: 'Book your free consultation',
  description:
    'Choose a time for a free 45-minute video consultation with MOVES. No pressure and no obligation.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-image-preview': 'none',
      'max-snippet': 0,
    },
  },
};

const bookingMarkup = fs.readFileSync(
  path.join(process.cwd(), 'public', 'booking-v2', 'markup.html'),
  'utf8',
);

export default function BookingPage() {
  return (
    <>
      <BookingBodyClass />
      <link rel="stylesheet" href="/booking-v2/styles.v4.css" />
      <main
        id="main"
        className="is-light booking-root"
        dangerouslySetInnerHTML={{ __html: bookingMarkup }}
      />
      <Script src="/booking-v2/interactions.v5.js?v=2" strategy="afterInteractive" />
    </>
  );
}
