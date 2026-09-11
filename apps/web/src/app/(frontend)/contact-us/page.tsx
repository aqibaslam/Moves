import '../landing/landing.css';
import '../landing-2026/landing-2026.css';
import './contact-us.css';

import type { Metadata } from 'next';

import { getSiteData } from '@/lib/cms';

import { Header, type HeaderData } from '@/components/landing/Header';
import { FooterDark } from '@/components/landing2026/FooterDark';

import { ContactHero } from '@/components/contact2026/ContactHero';
import { ContactInfo } from '@/components/contact2026/ContactInfo';
import { ContactForm } from '@/components/contact2026/ContactForm';

export const metadata: Metadata = {
  title: 'Contact us · Moves',
  description:
    'Let’s talk about your smile. Call, email or message the MOVES team and we’ll guide you on your next steps.',
};

export const dynamic = 'force-dynamic';

/** Contact Us — 2026 (Figma node 533:476). Reuses the 2026 design system (.lp26)
 *  so the shared header + footer match the rest of the rebrand. */
export default async function ContactUs() {
  const site = await getSiteData();
  return (
    <div className="moves-page landing-2 lp26 contact26">
      <div className="hero-unit lp26-hu">
        <Header data={site.header as HeaderData} logoSrc="/images/lp26-logo.png" />
        <ContactHero />
      </div>

      <ContactInfo />
      <ContactForm />

      <FooterDark />
    </div>
  );
}
