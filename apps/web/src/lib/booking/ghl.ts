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
const MIN_NOTICE_MINUTES = 90;

// HighLevel requires the custom-field id in contact writes. These ids belong
// to the MOVES location and deliberately keep paid-click attribution on the
// contact record, where the CRM and reporting workflows can use it.
const CONTACT_FIELDS = {
  age: 'VYxeTGV3eF44hoa5RhW3',
  concern: '2Fz3hkmcnfOSXPBAqjka',
  referralCode: '6hF8nEQmt1iF52WRPZVV',
  landingPageVariant: 'x0zJThFPdbLAgf4yvWym',
  utmSource: 'XxBJvQy4MctoR418cTI3',
  utmMedium: 'RT21TVHaBBers7PzJYQi',
  utmCampaign: 'EK10nCzAMHJ2eMHkh6T2',
  utmContent: 'wAQyQShzU40wjkRxIwTG',
  utmTerm: 'cJxwx2hkW7fOih2Gz8oy',
  fbclid: 'MIKFJGvvpy2AeYWMHuaV',
} as const;

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

export class BookingConflictError extends Error {
  constructor() {
    super('The selected time is no longer available.');
    this.name = 'BookingConflictError';
  }
}

export function isBookingConflict(error: unknown): error is BookingConflictError {
  return error instanceof BookingConflictError;
}

// ── Label formatting (always in clinic tz) ───────────────────────────────────

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: CLINIC_TZ,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
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
  return timeFmt.format(d);
}

/** "YYYY-MM-DD" for a given instant, in clinic tz. */
function dateKey(d: Date): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: CLINIC_TZ }).format(d);
}

/** Human summary, e.g. "Wednesday 12 August at 09:00". */
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
  const start = new Date(now.getTime() + MIN_NOTICE_MINUTES * 60 * 1000);
  const end = new Date(now.getTime() + WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const { live } = config();
  const instants = live ? await fetchLiveSlots(start, end) : buildStubSlots(start, end);
  return groupByDay(instants).slice(0, 3);
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
    contactId,
    startISO,
    when,
    meetingUrl: appointment.meetingUrl ?? null,
    stub: false,
  };
}

export interface LiveAppointment {
  id: string;
  contactId: string | null;
  startISO: string;
  endISO: string | null;
  meetingUrl: string | null;
  status: string;
}

/** Read the current GHL event before a Wallet update so moved/cancelled calls never get stale reminders. */
export async function getLiveAppointment(appointmentId: string): Promise<LiveAppointment | null> {
  if (!config().live) return null;
  const res = await fetch(`${BASE}/calendars/events/appointments/${encodeURIComponent(appointmentId)}`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GHL appointment read failed: ${res.status} ${await safeText(res)}`);
  const data = (await res.json()) as {
    id?: string;
    event?: Record<string, unknown>;
    appointment?: Record<string, unknown>;
  } & Record<string, unknown>;
  const value = (data.appointment ?? data.event ?? data) as Record<string, unknown>;
  const start = value.startTime;
  if (typeof start !== 'string') return null;
  const end = value.endTime;
  const address = value.address;
  return {
    id: typeof value.id === 'string' ? value.id : appointmentId,
    contactId: typeof value.contactId === 'string' ? value.contactId : null,
    startISO: new Date(start).toISOString(),
    endISO: typeof end === 'string' ? new Date(end).toISOString() : null,
    meetingUrl: typeof address === 'string' && isUrl(address) ? address : null,
    status: String(value.appointmentStatus ?? value.status ?? 'confirmed').toLowerCase(),
  };
}

export type WalletContactEvent = 'clicked' | 'added' | 'removed';

/** Make Wallet engagement visible on the GHL contact without exposing CRM credentials to the browser. */
export async function syncWalletContact(
  contactId: string | null,
  platform: 'apple' | 'google',
  event: WalletContactEvent,
): Promise<void> {
  if (!contactId || !config().live) return;
  const tags = [
    'wallet-engaged',
    `wallet-${platform}-${event}`,
    ...(event === 'added' ? ['wallet-added'] : []),
  ];
  const response = await fetch(`${BASE}/contacts/${encodeURIComponent(contactId)}/tags`, {
    method: 'POST',
    headers: headers(),
    cache: 'no-store',
    body: JSON.stringify({ tags }),
  });
  if (!response.ok) {
    throw new Error(`GHL Wallet tag sync failed: ${response.status} ${await safeText(response)}`);
  }
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
  const customFields = [
    { id: CONTACT_FIELDS.age, field_value: String(input.age) },
    field(CONTACT_FIELDS.concern, input.concern),
    field(CONTACT_FIELDS.referralCode, input.referralCode),
    field(CONTACT_FIELDS.landingPageVariant, input.landingPageVariant),
    field(CONTACT_FIELDS.utmSource, input.utmSource),
    field(CONTACT_FIELDS.utmMedium, input.utmMedium),
    field(CONTACT_FIELDS.utmCampaign, input.utmCampaign),
    field(CONTACT_FIELDS.utmContent, input.utmContent),
    field(CONTACT_FIELDS.utmTerm, input.utmTerm),
    field(CONTACT_FIELDS.fbclid, input.fbclid),
  ].filter((value): value is { id: string; field_value: string } => Boolean(value));
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
      source: input.utmSource ? `MOVES paid landing · ${input.utmSource}` : 'MOVES website consultation',
      tags: [
        'consultation-lead',
        input.utmSource ? 'paid-landing' : 'website',
        ...(input.trackingConsent ? ['meta-consented'] : []),
      ],
      customFields,
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

function field(id: string, value?: string): { id: string; field_value: string } | null {
  const clean = value?.trim();
  return clean ? { id, field_value: clean } : null;
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
    const details = await safeText(res);
    if (res.status === 409) throw new BookingConflictError();
    throw new Error(`GHL appointment create failed: ${res.status} ${details}`);
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
 * Deterministic mock availability: Monday–Saturday, 45-minute starts from
 * 9am–8pm, and a few slots dropped per day so it reads as
 * partially-booked. No randomness, so the demo is stable across renders.
 */
function buildStubSlots(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  const STARTS = Array.from({ length: 14 }, (_, index) => {
    const totalMinutes = 9 * 60 + index * CONSULT_MINUTES;
    return { hour: Math.floor(totalMinutes / 60), minute: totalMinutes % 60 };
  });
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));

  for (let day = 0; cursor <= end && day < WINDOW_DAYS + 2; day++) {
    const dow = cursor.getUTCDay();
    if (dow !== 0) {
      STARTS.forEach(({ hour, minute }) => {
        const instant = londonWallTime(
          cursor.getUTCFullYear(),
          cursor.getUTCMonth() + 1,
          cursor.getUTCDate(),
          hour,
          minute,
        );
        // Match the approved prototype's stable 40%-open demo density.
        const demoDate = new Date(
          Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate()),
        ).toDateString();
        if (stableHash(`${demoDate}|${hour * 60 + minute}`) % 10 >= 4) return;
        if (instant.getTime() >= start.getTime() && instant.getTime() <= end.getTime()) {
          out.push(instant);
        }
      });
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 2246822507);
  hash ^= hash >>> 13;
  return hash >>> 0;
}

/** Convert a London wall-clock time into its UTC instant, including BST. */
function londonWallTime(year: number, month: number, day: number, hour: number, minute: number): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: CLINIC_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(guess));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  const renderedAsUtc = Date.UTC(
    value('year'),
    value('month') - 1,
    value('day'),
    value('hour'),
    value('minute'),
  );
  return new Date(guess - (renderedAsUtc - guess));
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function groupByDay(instants: Date[]): AvailabilityDay[] {
  const byDay = new Map<string, SlotTime[]>();
  for (const d of instants) {
    if (weekdayFmt.format(d) === 'Sun') continue;
    const minutes = clinicMinutes(d);
    if (minutes < 9 * 60 || minutes + CONSULT_MINUTES > 20 * 60) continue;
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

function clinicMinutes(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: CLINIC_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type: 'hour' | 'minute') =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return value('hour') * 60 + value('minute');
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
