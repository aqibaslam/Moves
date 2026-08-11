/**
 * GoHighLevel (HighLevel) API v2 client — SERVER ONLY.
 *
 * Holds the Private Integration Token and talks to the LeadConnector API on
 * behalf of the booking flow. Never import this from a client component; the
 * `server-only` guard makes that a build error.
 *
 * When the GHL_* env vars are absent the client runs in STUB mode and returns
 * realistic mock availability so the whole wizard is demoable before the CRM
 * is wired in. Drop the three env vars in and it switches to live with no code
 * change.
 */
import 'server-only';

import {
  CONSULT_MINUTES,
  type AvailabilityDay,
  type BookingConfirmation,
  type BookingSubmit,
  type SlotTime,
} from './types';

const BASE = 'https://services.leadconnectorhq.com';
const API_VERSION = '2021-04-15';
const CLINIC_TZ = 'Europe/London';

/** How far ahead to offer slots, and the earliest notice we require. */
const WINDOW_DAYS = 21;
const MIN_NOTICE_HOURS = 24;

interface GhlConfig {
  token?: string;
  calendarId?: string;
  locationId?: string;
  live: boolean;
}

function config(): GhlConfig {
  const token = process.env.GHL_API_TOKEN;
  const calendarId = process.env.GHL_CALENDAR_ID;
  const locationId = process.env.GHL_LOCATION_ID;
  return { token, calendarId, locationId, live: Boolean(token && calendarId && locationId) };
}

/** True when real GHL credentials are configured. */
export function isLive(): boolean {
  return config().live;
}

// ── Label formatting (always in clinic tz) ───────────────────────────────────

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: CLINIC_TZ,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});
const weekdayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: CLINIC_TZ, weekday: 'short' });
const dayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: CLINIC_TZ, day: 'numeric', month: 'short' });
const longFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: CLINIC_TZ,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

function timeLabel(d: Date): string {
  // en-GB gives "9:00 am" — normalise the am/pm casing.
  return timeFmt.format(d).replace(/\s?([ap])\.?m\.?/i, (_m, p) => ` ${p.toLowerCase()}m`);
}

/** "YYYY-MM-DD" for a given instant, in clinic tz. */
function dateKey(d: Date): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: CLINIC_TZ }).format(d);
}

/** Human summary, e.g. "Wednesday 12 August at 9:00 am". */
export function describeWhen(startISO: string): string {
  const d = new Date(startISO);
  return `${longFmt.format(d)} at ${timeLabel(d)}`;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Available consultation slots for the next {@link WINDOW_DAYS} days, grouped
 * by day. Falls back to mock data when GHL is not configured.
 */
export async function getFreeSlots(): Promise<AvailabilityDay[]> {
  const now = new Date();
  const start = new Date(now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000);
  const end = new Date(now.getTime() + WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const { live } = config();
  const instants = live ? await fetchLiveSlots(start, end) : buildStubSlots(start, end);
  return groupByDay(instants);
}

/**
 * Upsert the contact and book the appointment. Returns a confirmation. In stub
 * mode this succeeds without touching any network.
 */
export async function createBooking(input: BookingSubmit): Promise<BookingConfirmation> {
  const startISO = input.slotStart;
  const endISO = new Date(new Date(startISO).getTime() + CONSULT_MINUTES * 60 * 1000).toISOString();
  const when = describeWhen(startISO);

  if (!config().live) {
    return {
      appointmentId: `stub-${dateKey(new Date(startISO))}-${new Date(startISO).getTime()}`,
      startISO,
      when,
      meetingUrl: null,
      stub: true,
    };
  }

  const contactId = await upsertContact(input);
  const appointment = await createAppointment(contactId, startISO, endISO);

  return {
    appointmentId: appointment.id,
    startISO,
    when,
    meetingUrl: appointment.meetingUrl ?? null,
    stub: false,
  };
}

// ── Live GHL calls ──────────────────────────────────────────────────────────

function headers(): HeadersInit {
  const { token } = config();
  return {
    Authorization: `Bearer ${token}`,
    Version: API_VERSION,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

async function fetchLiveSlots(start: Date, end: Date): Promise<Date[]> {
  const { calendarId } = config();
  const url = new URL(`${BASE}/calendars/${calendarId}/free-slots`);
  // GHL expects epoch millis for the date range.
  url.searchParams.set('startDate', String(start.getTime()));
  url.searchParams.set('endDate', String(end.getTime()));
  url.searchParams.set('timezone', CLINIC_TZ);

  const res = await fetch(url, { headers: headers(), cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`GHL free-slots failed: ${res.status} ${await safeText(res)}`);
  }
  const data: unknown = await res.json();
  return parseFreeSlots(data);
}

/**
 * GHL returns an availability map keyed by date:
 *   { "2026-08-12": { slots: ["2026-08-12T09:00:00+01:00", ...] }, traceId: "…" }
 * Iterate the date-shaped keys defensively and flatten to instants.
 */
function parseFreeSlots(data: unknown): Date[] {
  if (!data || typeof data !== 'object') return [];
  const out: Date[] = [];
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    const slots = (value as { slots?: unknown })?.slots;
    if (!Array.isArray(slots)) continue;
    for (const s of slots) {
      if (typeof s !== 'string') continue;
      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) out.push(d);
    }
  }
  return out.sort((a, b) => a.getTime() - b.getTime());
}

async function upsertContact(input: BookingSubmit): Promise<string> {
  const { locationId } = config();
  const res = await fetch(`${BASE}/contacts/upsert`, {
    method: 'POST',
    headers: headers(),
    cache: 'no-store',
    body: JSON.stringify({
      locationId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: normalisePhone(input.phone),
      source: 'Moves consultation booking',
      customFields: [
        { key: 'age', field_value: String(input.age) },
        ...(input.referralCode ? [{ key: 'referral_code', field_value: input.referralCode }] : []),
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`GHL contact upsert failed: ${res.status} ${await safeText(res)}`);
  }
  const data = (await res.json()) as { contact?: { id?: string }; id?: string };
  const id = data.contact?.id ?? data.id;
  if (!id) throw new Error('GHL contact upsert returned no id');
  return id;
}

async function createAppointment(
  contactId: string,
  startISO: string,
  endISO: string,
): Promise<{ id: string; meetingUrl?: string }> {
  const { calendarId, locationId } = config();
  const res = await fetch(`${BASE}/calendars/events/appointments`, {
    method: 'POST',
    headers: headers(),
    cache: 'no-store',
    body: JSON.stringify({
      calendarId,
      locationId,
      contactId,
      startTime: startISO,
      endTime: endISO,
      title: 'Moves — Free online consultation',
      appointmentStatus: 'confirmed',
      ignoreDateRange: false,
      toNotify: true,
    }),
  });
  if (!res.ok) {
    throw new Error(`GHL appointment create failed: ${res.status} ${await safeText(res)}`);
  }
  const data = (await res.json()) as {
    id?: string;
    appointment?: { id?: string; address?: string };
    address?: string;
  };
  const id = data.appointment?.id ?? data.id;
  if (!id) throw new Error('GHL appointment create returned no id');
  // For Google Meet / Zoom calendars GHL puts the join link in `address`.
  const meetingUrl = data.appointment?.address ?? data.address;
  return { id, meetingUrl: isUrl(meetingUrl) ? meetingUrl : undefined };
}

// ── Stub data ─────────────────────────────────────────────────────────────────

/**
 * Deterministic mock availability: weekdays only, hourly 9am–4pm with lunch at
 * 1pm removed, and a couple of slots dropped per day so it reads as
 * partially-booked. No randomness, so the demo is stable across renders.
 */
function buildStubSlots(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  const HOURS = [9, 10, 11, 12, 14, 15, 16]; // 13:00 lunch omitted
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));

  for (let day = 0; cursor <= end && day < WINDOW_DAYS + 2; day++) {
    const dow = cursor.getUTCDay();
    if (dow !== 0 && dow !== 6) {
      HOURS.forEach((h, i) => {
        // Drop ~2 slots per day in a fixed pattern to look booked.
        if ((day + i) % 4 === 0) return;
        const instant = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate(), h, 0));
        if (instant.getTime() >= start.getTime() && instant.getTime() <= end.getTime()) {
          out.push(instant);
        }
      });
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function groupByDay(instants: Date[]): AvailabilityDay[] {
  const byDay = new Map<string, SlotTime[]>();
  for (const d of instants) {
    const key = dateKey(d);
    const list = byDay.get(key) ?? [];
    list.push({ startISO: d.toISOString(), label: timeLabel(d) });
    byDay.set(key, list);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, times]) => {
      const ref = new Date(times[0].startISO);
      return {
        date,
        weekdayLabel: weekdayFmt.format(ref),
        dayLabel: dayFmt.format(ref),
        times: times.sort((a, b) => a.startISO.localeCompare(b.startISO)),
      };
    });
}

function normalisePhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('0')) return `+44${digits.slice(1)}`;
  return digits;
}

function isUrl(v: unknown): v is string {
  return typeof v === 'string' && /^https?:\/\//.test(v);
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 300);
  } catch {
    return '';
  }
}
