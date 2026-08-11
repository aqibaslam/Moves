'use server';

import { createBooking, getFreeSlots, isLive } from '@/lib/booking/ghl';
import { bookingSubmitSchema, type AvailabilityDay, type BookingConfirmation } from '@/lib/booking/types';

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
    return { ok: true, confirmation };
  } catch (err) {
    console.error('[booking] createBooking failed', err);
    return { ok: false, error: 'Something went wrong booking your slot. Please try again.' };
  }
}
