'use server';

import config from '@payload-config';
import { getPayload } from 'payload';
import { createBooking, getFreeSlots, isLive } from '@/lib/booking/ghl';
import {
  bookingSubmitSchema,
  type AvailabilityDay,
  type BookingConfirmation,
  type BookingSubmit,
} from '@/lib/booking/types';

export type FetchSlotsResult =
  | { ok: true; days: AvailabilityDay[]; live: boolean }
  | { ok: false; error: string };

/** Load available consultation slots for the booking wizard's Step 2. */
export async function fetchSlotsAction(): Promise<FetchSlotsResult> {
  try {
    const days = await getFreeSlots();
    return { ok: true, days, live: isLive() };
  } catch (err) {
    console.error('[booking] fetchSlots failed', err);
    return { ok: false, error: 'We couldn’t load available times right now. Please try again.' };
  }
}

export type CreateBookingResult =
  | { ok: true; confirmation: BookingConfirmation }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };


/**
 * Mirror a confirmed booking into the consultations table so it shows in the
 * dashboard and is owned by our database, not only GoHighLevel.
 *
 * Deliberately best-effort: the appointment is already booked in the calendar
 * by the time this runs, so a database hiccup must NOT tell the patient their
 * booking failed. We log loudly and move on; the row can be reconciled later.
 */
async function recordConsultation(
  data: BookingSubmit,
  confirmation: BookingConfirmation,
): Promise<void> {
  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: 'consultations',
      overrideAccess: true, // trusted server write on behalf of an anonymous booker
      data: {
        patientName: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        scheduledFor: confirmation.startISO,
        status: 'upcoming',
        source: 'Website',
        notes: [
          `Age: ${data.age}`,
          data.referralCode ? `Referral: ${data.referralCode}` : null,
          `GHL appointment: ${confirmation.appointmentId}`,
          confirmation.meetingUrl ? `Meeting: ${confirmation.meetingUrl}` : null,
          confirmation.stub ? '(booked in stub mode — no live calendar)' : null,
        ]
          .filter(Boolean)
          .join('\n'),
      },
    });
  } catch (err) {
    console.error('[booking] failed to mirror consultation into the database', err);
  }
}

/** Validate the full submission and book the slot in GHL (or stub). */
export async function createBookingAction(input: unknown): Promise<CreateBookingResult> {
  const parsed = bookingSubmitSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      error: 'Please check the highlighted fields and try again.',
      fieldErrors,
    };
  }

  try {
    const confirmation = await createBooking(parsed.data);
    await recordConsultation(parsed.data, confirmation);
    return { ok: true, confirmation };
  } catch (err) {
    console.error('[booking] createBooking failed', err);
    return { ok: false, error: 'Something went wrong booking your slot. Please try again.' };
  }
}
