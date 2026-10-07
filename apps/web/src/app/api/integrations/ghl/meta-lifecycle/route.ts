import { timingSafeEqual } from 'node:crypto';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { sendMetaLifecycleEvent } from '@/lib/analytics/meta';
import { getLifecycleContact } from '@/lib/booking/ghl';

export const runtime = 'nodejs';

const requestSchema = z
  .object({
    event: z.enum(['ConsultationAttended', 'QualifiedLead', 'Purchase']),
    contactId: z.string().trim().min(1).max(100),
    appointmentId: z.string().trim().max(100).optional(),
    opportunityId: z.string().trim().max(100).optional(),
    eventId: z.string().trim().max(160).optional(),
    occurredAt: z.string().datetime({ offset: true }).optional(),
    value: z.coerce.number().positive().optional(),
    currency: z.string().trim().length(3).default('GBP'),
    trackingConsent: z
      .union([z.boolean(), z.enum(['true', 'false', 'yes', 'no', '1', '0'])])
      .optional()
      .transform((value) =>
        typeof value === 'boolean' ? value : ['true', 'yes', '1'].includes(value ?? ''),
      ),
    email: z.string().trim().email().optional(),
    phone: z.string().trim().min(6).max(32).optional(),
    firstName: z.string().trim().max(100).optional(),
    lastName: z.string().trim().max(100).optional(),
    fbc: z.string().trim().max(500).optional(),
    fbp: z.string().trim().max(500).optional(),
    fbclid: z.string().trim().max(500).optional(),
    contactCreatedAt: z.string().datetime({ offset: true }).optional(),
    sourceUrl: z.string().trim().url().max(2_000).optional(),
  })
  .superRefine((value, context) => {
    if (!value.eventId && !value.appointmentId && !value.opportunityId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'An appointment, opportunity or explicit event id is required',
      });
    }
    if (value.event === 'Purchase' && !value.value) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'Purchase requires value' });
    }
  });

function authorised(request: Request): boolean {
  const expected = process.env.GHL_META_WEBHOOK_SECRET;
  const received = request.headers.get('x-moves-workflow-secret');
  if (!expected || !received) return false;
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  return (
    expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes)
  );
}

function stableEventId(input: z.infer<typeof requestSchema>): string {
  if (input.eventId) return input.eventId;
  const base = input.opportunityId || input.appointmentId || input.contactId;
  return `moves:${input.event}:${base}`.slice(0, 160);
}

function reconstructedFbc(fbclid?: string, contactCreatedAt?: string): string | null {
  if (!fbclid || !contactCreatedAt) return null;
  const timestamp = new Date(contactCreatedAt).getTime();
  return Number.isFinite(timestamp) ? `fb.1.${Math.floor(timestamp)}.${fbclid}` : null;
}

export async function POST(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid lifecycle event', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  let contact = null;
  try {
    contact = await getLifecycleContact(parsed.data.contactId);
  } catch (error) {
    // Some least-privilege booking tokens can write contacts but not read them.
    // Authenticated workflows may supply the same minimal fields in the request.
    console.warn('[meta-lifecycle] GHL contact lookup unavailable; using signed workflow data', {
      event: parsed.data.event,
      error: error instanceof Error ? error.message.split('{')[0].trim() : 'unknown',
    });
  }
  contact ??= {
    id: parsed.data.contactId,
    email: parsed.data.email ?? null,
    phone: parsed.data.phone ?? null,
    firstName: parsed.data.firstName ?? null,
    lastName: parsed.data.lastName ?? null,
    trackingConsent: parsed.data.trackingConsent,
    fbc: parsed.data.fbc ?? reconstructedFbc(parsed.data.fbclid, parsed.data.contactCreatedAt),
    fbp: parsed.data.fbp ?? null,
    sourceUrl: parsed.data.sourceUrl ?? null,
  };
  if (!contact) {
    return NextResponse.json({ ok: false, error: 'Contact not found' }, { status: 404 });
  }
  if (!contact.trackingConsent) {
    return NextResponse.json({ ok: true, skipped: 'tracking-consent-not-recorded' });
  }

  const eventId = stableEventId(parsed.data);
  const receipt = await sendMetaLifecycleEvent({
    eventName: parsed.data.event,
    eventId,
    occurredAt: parsed.data.occurredAt,
    sourceUrl: contact.sourceUrl,
    value: parsed.data.value,
    currency: parsed.data.currency,
    contact,
  });
  if (!receipt) {
    return NextResponse.json({ ok: false, error: 'Meta CAPI is not configured' }, { status: 503 });
  }

  console.info('[meta-lifecycle] accepted', {
    event: parsed.data.event,
    eventId,
    eventsReceived: receipt.eventsReceived,
    traceId: receipt.traceId,
  });
  return NextResponse.json({ ok: true, eventId, ...receipt });
}
