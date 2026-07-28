import 'server-only';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

/**
 * Fetches every landing-page global from Payload.
 *
 * Resilient by design: if the database isn't configured yet (no DATABASE_URL,
 * Supabase not created, not migrated) any/all fetches fail softly and return
 * null, so each component falls back to its built-in default content and the
 * page still renders. Once the CMS is seeded, the real content flows through.
 */

export const SECTION_SLUGS = [
  'header',
  'hero',
  'problem',
  'manifesto',
  'marquee',
  'how-it-works',
  'before-afters',
  'pricing',
  'reviews',
  'team',
  'proof',
  'movers',
  'cta',
  'faqs',
  'footer',
] as const;

export type SectionSlug = (typeof SECTION_SLUGS)[number];
export type SiteData = Record<string, Record<string, unknown> | null>;

export async function getSiteData(): Promise<SiteData> {
  // Reads from the active database (Supabase Postgres in prod, local SQLite in
  // dev). If it's unreachable or unseeded, sections fall back to built-in copy.
  try {
    const payload = await getPayload({ config: configPromise });
    const entries = await Promise.all(
      SECTION_SLUGS.map(async (slug) => {
        try {
          // depth 2 so uploads (media) and nested array uploads come back populated
          const doc = await payload.findGlobal({ slug: slug as never, depth: 2 });
          return [slug, doc as Record<string, unknown>] as const;
        } catch {
          return [slug, null] as const;
        }
      }),
    );
    return Object.fromEntries(entries);
  } catch {
    // DB unreachable / not configured — every section uses its fallback content.
    return {};
  }
}
