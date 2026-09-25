/**
 * Home page copy — one place to read, review and edit every word.
 *
 * Voice (Brand Guidelines v1.3 §03): dry, confident, British. Lead with the
 * move, not the price. No "smile journey", no clinical jargon, no shouting.
 *
 * Facts here come from the existing funnel content (plans, inclusions,
 * finance).
 */

/* Real routes on the site today. */
export const NAV_LINKS = [
  { label: 'Clear aligners', href: '/clear-aligners' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Results', href: '/results' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about-us' },
] as const;

export const CTA_LABEL = 'Book free consultation';
export const CTA_LABEL_SHORT = 'Book free';

/* Lead line and body voice are the brand book's own (v1.3 §03, §06):
   "Lead with: Make your Move." / "Clinician-led from start to finish.
   Pricing that's clear from day one. No hard sell. No hidden extras." */
export const HERO = {
  kicker: 'Clear aligners',
  titleLead: 'Make your',
  titleAccent: 'Move.',
  points: [
    'Signed by a named, GDC-registered dentist',
    'Retainers and whitening included',
    'Every price published. No hidden extras.',
  ],
  proof: { rating: 'Excellent', count: '(100+)', finance: '0% APR finance available' },
  photo: {
    src: '/images/home/hero-00734.jpg',
    alt: 'A woman smiles broadly, looking off to one side',
    pos: ['38% 50%', '60% 55%'],
  },
} as const;
