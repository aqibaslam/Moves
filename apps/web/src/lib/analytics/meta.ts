import 'server-only';

import { createHash } from 'node:crypto';

import type { BookingConfirmation, BookingSubmit } from '@/lib/booking/types';

interface MetaScheduleContext {
  confirmation: BookingConfirmation;
  booking: BookingSubmit;
  clientIp?: string | null;
  clientUserAgent?: string | null;
}

export type MetaLifecycleEventName = 'ConsultationAttended' | 'QualifiedLead' | 'Purchase';

export interface MetaLifecycleContact {
  id: string;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fbc?: string | null;
  fbp?: string | null;
}

interface MetaLifecycleContext {
  eventName: MetaLifecycleEventName;
  eventId: string;
  contact: MetaLifecycleContact;
  occurredAt?: string | null;
  sourceUrl?: string | null;
  value?: number | null;
  currency?: string | null;
}

export interface MetaEventReceipt {
  eventsReceived: number;
  traceId: string | null;
}

function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function normalisePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('0') ? `44${digits.slice(1)}` : digits;
}

function eventTime(value?: string | null): number {
  if (!value) return Math.floor(Date.now() / 1000);
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : Math.floor(Date.now() / 1000);
}

function metaConfig(): { datasetId?: string; accessToken?: string; version: string; testEventCode?: string } {
  return {
    datasetId: process.env.META_DATASET_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID,
    accessToken: process.env.META_CAPI_ACCESS_TOKEN,
    version: process.env.META_GRAPH_API_VERSION?.trim() || 'v24.0',
    testEventCode: process.env.META_TEST_EVENT_CODE?.trim() || undefined,
  };
}

async function postMetaEvent(
  event: Record<string, unknown>,
): Promise<MetaEventReceipt | null> {
  const { datasetId, accessToken, version, testEventCode } = metaConfig();
  if (!datasetId || !accessToken) return null;

  const response = await fetch(
    `https://graph.facebook.com/${version}/${encodeURIComponent(datasetId)}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        data: [event],
        ...(testEventCode ? { test_event_code: testEventCode } : {}),
      }),
    },
  );
  const body = (await response.json().catch(() => null)) as {
    events_received?: number;
    fbtrace_id?: string;
    error?: { message?: string; code?: number };
  } | null;
  if (!response.ok || body?.events_received !== 1) {
    const reason = body?.error?.message || `events_received=${body?.events_received ?? 'missing'}`;
    throw new Error(`Meta CAPI event failed: ${response.status} ${reason}`);
  }

  return { eventsReceived: body.events_received, traceId: body.fbtrace_id ?? null };
}

/**
 * Send the server half of Meta's deduplicated Schedule event. The browser uses
 * the appointment id as the same eventID. No clinical answers are transmitted.
 */
export async function sendMetaSchedule({
  confirmation,
  booking,
  clientIp,
  clientUserAgent,
}: MetaScheduleContext): Promise<MetaEventReceipt | null> {
  if (!booking.trackingConsent || confirmation.stub) return null;

  const userData: Record<string, string[]> & {
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
  } = {
    em: [sha256(booking.email)],
    ph: [sha256(normalisePhone(booking.phone))],
    fn: [sha256(booking.firstName)],
    ln: [sha256(booking.lastName)],
    country: [sha256('gb')],
  };
  if (confirmation.contactId) userData.external_id = [sha256(confirmation.contactId)];
  if (clientIp) userData.client_ip_address = clientIp;
  if (clientUserAgent) userData.client_user_agent = clientUserAgent;
  if (booking.fbc) userData.fbc = booking.fbc;
  if (booking.fbp) userData.fbp = booking.fbp;

  return postMetaEvent({
    event_name: 'Schedule',
    event_time: Math.floor(Date.now() / 1000),
    event_id: confirmation.appointmentId,
    action_source: 'website',
    event_source_url: booking.eventSourceUrl || 'https://movesuk.com/book',
    user_data: userData,
    custom_data: { content_name: 'Free video consultation' },
  });
}

/**
 * Send a consented, server-only CRM outcome to Meta. The payload is deliberately
 * restricted to match keys and commercial state: no age, smile concern,
 * treatment notes or other clinical information is ever sent.
 */
export async function sendMetaLifecycleEvent({
  eventName,
  eventId,
  contact,
  occurredAt,
  sourceUrl,
  value,
  currency,
}: MetaLifecycleContext): Promise<MetaEventReceipt | null> {
  const userData: Record<string, string[]> & { fbc?: string; fbp?: string } = {
    external_id: [sha256(contact.id)],
    country: [sha256('gb')],
  };
  if (contact.email) userData.em = [sha256(contact.email)];
  if (contact.phone) userData.ph = [sha256(normalisePhone(contact.phone))];
  if (contact.firstName) userData.fn = [sha256(contact.firstName)];
  if (contact.lastName) userData.ln = [sha256(contact.lastName)];
  if (contact.fbc) userData.fbc = contact.fbc;
  if (contact.fbp) userData.fbp = contact.fbp;

  const contentName =
    eventName === 'ConsultationAttended'
      ? 'Consultation attended'
      : eventName === 'QualifiedLead'
        ? 'Consultation qualified'
        : 'Clear aligner treatment';
  const customData: Record<string, unknown> = { content_name: contentName };
  if (eventName === 'Purchase') {
    if (!value || value <= 0) throw new Error('Meta Purchase requires a positive value');
    customData.value = value;
    customData.currency = (currency || 'GBP').toUpperCase();
    customData.order_id = eventId;
  }

  return postMetaEvent({
    event_name: eventName,
    event_time: eventTime(occurredAt),
    event_id: eventId,
    action_source: 'system_generated',
    event_source_url: sourceUrl || 'https://movesuk.com/pages/clear-aligners',
    user_data: userData,
    custom_data: customData,
  });
}
