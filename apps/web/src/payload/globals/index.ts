import type { GlobalConfig } from 'payload';
import { headerGlobal } from './header';
import { heroGlobal } from './hero';
import { problemGlobal } from './problem';
import { manifestoGlobal } from './manifesto';
import { marqueeGlobal } from './marquee';
import { howItWorksGlobal } from './howItWorks';
import { beforeAftersGlobal } from './beforeAfters';
import { pricingGlobal } from './pricing';
import { reviewsGlobal } from './reviews';
import { teamGlobal } from './team';
import { proofGlobal } from './proof';
import { moversGlobal } from './movers';
import { ctaGlobal } from './cta';
import { faqsGlobal } from './faqs';
import { footerGlobal } from './footer';

/** All 14 landing-page sections, in the order they appear on the page. */
export const globals: GlobalConfig[] = [
  headerGlobal,
  heroGlobal,
  problemGlobal,
  manifestoGlobal,
  marqueeGlobal,
  howItWorksGlobal,
  beforeAftersGlobal,
  pricingGlobal,
  reviewsGlobal,
  teamGlobal,
  proofGlobal,
  moversGlobal,
  ctaGlobal,
  faqsGlobal,
  footerGlobal,
];
