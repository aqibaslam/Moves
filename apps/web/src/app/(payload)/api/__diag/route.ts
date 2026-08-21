/**
 * TEMPORARY diagnostic endpoint — DELETE AFTER USE.
 *
 * Reports whether the runtime env vars are present and well-formed, and
 * whether a database connection succeeds. Never returns secret values:
 * only booleans, lengths, the host, and error messages.
 *
 * Token-gated so it isn't a public information leak while it exists.
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TOKEN = 'diag-8f3a91c7';

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('t') !== TOKEN) {
    return new NextResponse('not found', { status: 404 });
  }

  const raw = process.env.DATABASE_URL ?? '';
  const secret = process.env.PAYLOAD_SECRET ?? '';

  const report: Record<string, unknown> = {
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: {
      present: Boolean(raw),
      length: raw.length,
      startsWithPostgres: raw.startsWith('postgres'),
      hasWhitespace: /\s/.test(raw),
      hasNewline: /[\r\n]/.test(raw),
      hasQuotes: /["']/.test(raw),
    },
    payloadSecret: {
      present: Boolean(secret),
      length: secret.length,
      hasWhitespace: /\s/.test(secret),
      hasNewline: /[\r\n]/.test(secret),
      hasQuotes: /["']/.test(secret),
    },
  };

  // Safe host extraction — no credentials.
  try {
    const u = new URL(raw);
    report.parsedHost = u.host;
    report.parsedDb = u.pathname;
  } catch (e) {
    report.parseError = e instanceof Error ? e.message : String(e);
  }

  // Payload init attempt — this is what actually 500s.
  try {
    const config = (await import('@payload-config')).default;
    const { getPayload } = await import('payload');
    await getPayload({ config });
    report.payload = { init: true };
  } catch (e) {
    report.payload = {
      init: false,
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack?.split('\n').slice(0, 6) : undefined,
    };
  }

  return NextResponse.json(report, { status: 200 });
}
