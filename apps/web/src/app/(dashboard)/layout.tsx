/* Dashboard root layout — provides its own <html>/<body>, like (payload) does.
   Separate route group from (frontend), so landing-page CSS never leaks in. */
import type { Metadata } from 'next';
import { aeonik, jost, silka } from '../(frontend)/fonts';
import '../(frontend)/globals.css';
import './dashboard.css';

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s · Moves Dashboard' },
  // An admin surface must never be indexed.
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jost.variable} ${silka.variable} ${aeonik.variable}`}>
      <body>{children}</body>
    </html>
  );
}
