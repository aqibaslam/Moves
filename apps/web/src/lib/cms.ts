import 'server-only';

/**
 * Fetches every landing-page global from Payload.
 *
 * Resilient by design: Payload (and its DB / sharp / sqlite native deps) is
 * loaded LAZILY and only when a database can actually be used. So on a host
 * with no database configured (e.g. Vercel before DATABASE_URL is set), the
 * public page renders entirely from each component's built-in fallback content
 * instead of crashing. Once a Postgres DATABASE_URL is set, real content flows.
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

/**
 * Only touch Payload when it's safe:
 *  - a real Postgres DATABASE_URL is set (works anywhere, incl. serverless), OR
 *  - we're in local development, where the SQLite fallback file is writable.
 * On a production host with no DATABASE_URL the local SQLite adapter cannot run
 * (read-only FS), so we skip it and serve fallback content.
 */
function canUseDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV !== 'production';
}

export async function getSiteData(): Promise<SiteData> {
  if (!canUseDatabase()) return {};

  try {
    // Lazy imports so the frontend bundle never eagerly loads Payload/sharp/db.
    const [{ getPayload }, { default: config }] = await Promise.all([
      import('payload'),
      import('@payload-config'),
    ]);
    const payload = await getPayload({ config });

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
