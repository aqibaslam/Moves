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

  const contact = await getLifecycleContact(parsed.data.contactId);
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
