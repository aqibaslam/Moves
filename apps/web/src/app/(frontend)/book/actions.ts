'use server';

import config from '@payload-config';
import { getPayload } from 'payload';
import { headers } from 'next/headers';
import { createBooking, getFreeSlots, isBookingConflict, isLive } from '@/lib/booking/ghl';
import { sendMetaSchedule } from '@/lib/analytics/meta';
import { walletAvailability } from '@/lib/wallet/config';
import { recordWalletBooking, walletStorageConfigured } from '@/lib/wallet/storage';
import { createWalletToken, walletSerialNumber, walletTokenConfigured } from '@/lib/wallet/token';
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
  | {
      ok: true;
      confirmation: BookingConfirmation;
      wallet: { appleUrl: string | null; googleUrl: string | null };
    }
  | { ok: false; error: string; code?: 'slot_taken'; fieldErrors?: Record<string, string> };


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
  // GHL is the production system of record. Payload falls back to a local
  // SQLite file for development, which cannot be opened inside Vercel's
  // read-only function bundle. Skip that optional mirror until DATABASE_URL
  // is deliberately configured instead of logging an error for every lead.
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) return;

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
          data.concern ? `Primary concern: ${data.concern}` : null,
          data.note ? `Note from patient: ${data.note}` : null,
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
    const requestHeaders = await headers();
    // GHL owns all customer communication so one workflow controls consent,
    // sender identity, reminders and the meeting link without duplicate SMS.
    // These post-booking writes remain best-effort, but are awaited so a
    // serverless invocation cannot terminate before attribution is delivered.
    const postBooking = await Promise.allSettled([
      recordConsultation(parsed.data, confirmation),
      sendMetaSchedule({
        confirmation,
        booking: parsed.data,
        clientIp: requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        clientUserAgent: requestHeaders.get('user-agent'),
      }),
    ]);
    if (postBooking[1].status === 'rejected') {
      console.error('[booking] Meta CAPI Schedule failed', postBooking[1].reason);
    } else if (postBooking[1].value) {
      console.info('[booking] Meta CAPI Schedule accepted', {
        appointmentId: confirmation.appointmentId,
        eventsReceived: postBooking[1].value.eventsReceived,
        traceId: postBooking[1].value.traceId,
      });
    }
    const availability = walletAvailability();
    let wallet = { appleUrl: null, googleUrl: null } as {
      appleUrl: string | null;
      googleUrl: string | null;
    };
    if (
      walletTokenConfigured() &&
      walletStorageConfigured() &&
      (availability.apple || availability.google)
    ) {
      try {
        const endISO = new Date(
          new Date(confirmation.startISO).getTime() + 45 * 60_000,
        ).toISOString();
        await recordWalletBooking({
          appointmentId: confirmation.appointmentId,
          serial: walletSerialNumber(confirmation.appointmentId),
          contactId: confirmation.contactId,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          startISO: confirmation.startISO,
          endISO,
          timezone: parsed.data.timezone,
          meetingUrl: confirmation.meetingUrl,
        });
        const token = await createWalletToken({
          appointmentId: confirmation.appointmentId,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          startISO: confirmation.startISO,
          meetingUrl: confirmation.meetingUrl,
        });
        wallet = {
          appleUrl: availability.apple ? `/api/wallet/apple/${token}` : null,
          googleUrl: availability.google ? `/api/wallet/google/${token}` : null,
        };
      } catch (walletError) {
        // The calendar booking is already confirmed. Never make the patient
        // retry and create a duplicate appointment because Wallet storage failed.
        console.error('[booking] Wallet setup failed after booking', walletError);
      }
    }
    return { ok: true, confirmation, wallet };
  } catch (err) {
    console.error('[booking] createBooking failed', err);
    if (isBookingConflict(err)) {
      return {
        ok: false,
        code: 'slot_taken',
        error: 'That time has just been booked. Please choose another.',
      };
    }
    return { ok: false, error: 'Something went wrong booking your slot. Please try again.' };
  }
}
