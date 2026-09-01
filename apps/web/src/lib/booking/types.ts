/**
 * Booking domain — shared zod schemas and types.
 *
 * Imported by the server actions (authoritative validation) and by the
 * client wizard (inline UX validation), so this file must stay free of
 * server-only imports.
 */
import { z } from 'zod';

/** Consultation length, in minutes. Mirrors the GHL calendar's slot duration. */
export const CONSULT_MINUTES = 45;

/** Names: letters (any script) with internal spaces, hyphens or apostrophes —
 *  e.g. "O'Brien", "Anne-Marie", "van der Berg". No digits or other symbols.
 *  Must start and end with a letter (2+ chars enforced separately). */
const NAME_RE = /^\p{L}(?:[\p{L}'’ \-]*\p{L})?$/u;

/** A validated UK mobile in local form: 07 followed by 9 digits (11 total). */
const UK_MOBILE = /^07\d{9}$/;

/** Reduce any accepted UK mobile spelling to the canonical 0-prefixed form.
 *  Handles +44 / 0044 / 44 country codes and strips spaces, dashes, brackets.
 *  GHL's own normaliser converts this 0-prefix back to +44 before sending. */
function toUkLocal(raw: string): string {
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (/^(?:\+44|0044|44)\d{10}$/.test(cleaned)) return '0' + cleaned.replace(/^(?:\+44|0044|44)/, '');
  return cleaned.replace(/^\+/, '');
}

/** Step 1 — the lead's details. */
export const bookingDetailsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'Please enter your first name (at least 2 letters)')
    .max(30, 'Please keep your first name under 30 characters')
    .regex(NAME_RE, 'Use letters only — hyphens and apostrophes are allowed'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Please enter your last name (at least 2 letters)')
    .max(30, 'Please keep your last name under 30 characters')
    .regex(NAME_RE, 'Use letters only — hyphens and apostrophes are allowed'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Please enter your email')
    .email('Please enter a valid email address')
    .max(200),
  phone: z
    .string()
    .trim()
    .min(1, 'Please enter your phone number')
    .transform(toUkLocal)
    .refine((v) => UK_MOBILE.test(v), 'Please enter a valid UK phone number'),
  age: z.coerce
    .number({ invalid_type_error: 'Please enter your age' })
    .int('Please enter your age')
    .min(15, 'You must be at least 15 to book')
    .max(120, 'Please enter a valid age'),
  referralCode: z.string().trim().max(60).optional().or(z.literal('')),
});
export type BookingDetails = z.infer<typeof bookingDetailsSchema>;

/** Final submit — details + chosen slot + consent. */
export const bookingSubmitSchema = bookingDetailsSchema.extend({
  slotStart: z.string().datetime({ offset: true, message: 'Please choose a time slot' }),
  timezone: z.string().min(1).default('Europe/London'),
  consent: z.boolean().refine((v) => v === true, 'Please accept the terms to continue'),
});
export type BookingSubmit = z.infer<typeof bookingSubmitSchema>;

/** A single bookable time within a day. Labels are pre-formatted server-side
 *  in the clinic timezone so the client never has to reason about zones. */
export interface SlotTime {
  /** ISO 8601 instant with offset, e.g. 2026-08-12T09:00:00+01:00 */
  startISO: string;
  /** Display label in clinic tz, e.g. "9:00 am" */
  label: string;
}

/** Availability for one calendar day. */
export interface AvailabilityDay {
  /** YYYY-MM-DD in clinic tz */
  date: string;
  /** e.g. "Wed" */
  weekdayLabel: string;
  /** e.g. "12 Aug" */
  dayLabel: string;
  times: SlotTime[];
}

/** Result of a booking. `meetingUrl` is null until the calendar provider
 *  (Google Meet / Zoom) attaches one, or when running in stub mode. */
export interface BookingConfirmation {
  appointmentId: string;
  startISO: string;
  /** Pre-formatted human label, e.g. "Wednesday 12 August at 9:00 am" */
  when: string;
  meetingUrl: string | null;
  /** True when no GHL credentials are configured (mock data). */
  stub: boolean;
}
