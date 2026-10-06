import 'server-only';

import { createHash } from 'node:crypto';

import type { BookingConfirmation, BookingSubmit } from '@/lib/booking/types';

interface MetaScheduleContext {
  confirmation: BookingConfirmation;
  booking: BookingSubmit;
  clientIp?: string | null;
  clientUserAgent?: string | null;
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
  const datasetId = process.env.META_DATASET_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!booking.trackingConsent || !datasetId || !accessToken || confirmation.stub) return null;

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

  const version = process.env.META_GRAPH_API_VERSION?.trim() || 'v24.0';
  const response = await fetch(
    `https://graph.facebook.com/${version}/${encodeURIComponent(datasetId)}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        data: [
          {
            event_name: 'Schedule',
            event_time: Math.floor(Date.now() / 1000),
            event_id: confirmation.appointmentId,
            action_source: 'website',
            event_source_url: booking.eventSourceUrl || 'https://movesuk.com/book',
            user_data: userData,
            custom_data: { content_name: 'Free video consultation' },
          },
        ],
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
    throw new Error(`Meta CAPI Schedule failed: ${response.status} ${reason}`);
  }

  return {
    eventsReceived: body.events_received,
    traceId: body.fbtrace_id ?? null,
  };
}
