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

/** UK mobile/landline: 0xxxxxxxxxx or +44xxxxxxxxxx, spaces allowed. */
const UK_PHONE = /^(?:\+?44\s?|0)(?:\d\s?){9,10}$/;

/** Step 1 — the lead's details. */
export const bookingDetailsSchema = z.object({
  firstName: z.string().trim().min(1, 'Please enter your first name').max(80),
  lastName: z.string().trim().min(1, 'Please enter your last name').max(80),
  email: z.string().trim().min(1, 'Please enter your email').email('Please enter a valid email address').max(200),
  phone: z
    .string()
    .trim()
    .min(1, 'Please enter your phone number')
    .regex(UK_PHONE, 'Please enter a valid UK phone number'),
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
