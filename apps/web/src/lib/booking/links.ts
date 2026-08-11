/**
 * Canonical link to the consultation booking wizard, plus a resolver for the
 * many "Book Free Consultation" CTAs across the landing + funnel pages.
 *
 * Historically those CTAs pointed at the on-page `#cta` banner (or a bare `#`
 * placeholder). Now they should all lead to the live booking flow, so this
 * maps those legacy placeholders to {@link BOOKING_PATH} while passing any real
 * href (e.g. `#pricing`, an external URL) straight through.
 *
 * Safe to import from both server and client components — no dependencies.
 */
export const BOOKING_PATH = '/book';

export function bookingHref(href?: string | null): string {
  if (!href || href === '#' || href === '#cta') return BOOKING_PATH;
  return href;
}
