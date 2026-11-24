import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createLead } from '@/lib/booking/ghl';
import {
  BLACK_FRIDAY_OFFER,
  BLACK_FRIDAY_SUBJECT,
  blackFridayWelcomeHtml,
  blackFridayWelcomeText,
} from '@/lib/email/black-friday-welcome';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const optional = (max: number) => z.string().trim().max(max).optional().or(z.literal(''));

const leadSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(200),
  /** Honeypot: real visitors never fill this. */
  website: z.string().max(200).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
  offer: optional(60),
  utmSource: optional(200),
  utmMedium: optional(200),
  utmCampaign: optional(200),
  utmContent: optional(200),
  utmTerm: optional(200),
  fbclid: optional(500),
  fbc: optional(500),
  fbp: optional(500),
  eventSourceUrl: z.string().url().max(2_000).optional().or(z.literal('')),
  landingPageVariant: optional(80),
  trackingConsent: z.boolean().optional().default(false),
});

/** Tiny per-instance throttle: 5 submissions / minute / IP. A best-effort
 *  guard against scripted spam into the CRM, not a security boundary. */
const hits = new Map<string, number[]>();
function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > 5;
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (throttled(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many attempts. Please try again shortly.' }, { status: 429 });
  }

  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check your email address.' },
      { status: 400 },
    );
  }

  // Honeypot tripped: pretend success so bots learn nothing, store nothing.
  if (parsed.data.website) return NextResponse.json({ ok: true });

  try {
    const { website: _website, consent: _consent, ...lead } = parsed.data;
    const welcome =
      lead.offer === BLACK_FRIDAY_OFFER
        ? { subject: BLACK_FRIDAY_SUBJECT, html: blackFridayWelcomeHtml(), text: blackFridayWelcomeText() }
        : undefined;
    const result = await createLead({ ...lead, welcome });
    return NextResponse.json({ ok: true, stub: result.stub, emailed: Boolean(result.emailed) });
  } catch (err) {
    console.error('[lead] GHL upsert failed', err);
    return NextResponse.json(
      { ok: false, error: 'We couldn’t save that just now. Please try again.' },
      { status: 502 },
    );
  }
}
