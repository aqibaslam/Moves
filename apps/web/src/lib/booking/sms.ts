/**
 * Booking-confirmation SMS via Twilio. SERVER ONLY.
 *
 * Stub-first, mirroring {@link ./ghl}: when the TWILIO_* env vars are absent
 * this runs in STUB mode — it logs what it *would* send and makes no network
 * call, so the booking flow works locally with zero setup. Fill all three
 * (Account SID, Auth Token, From number) to send for real. Never expose these
 * as NEXT_PUBLIC_* — the auth token bypasses your whole Twilio account.
 *
 * Best-effort by design: the slot is already booked by the time this runs, so
 * an SMS failure must never fail the booking. It resolves even on error, and
 * callers ignore the result.
 */
import type { BookingConfirmation, BookingSubmit } from './types';

const TWILIO_API = 'https://api.twilio.com/2010-04-01';

function config() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  return { accountSid, authToken, from, live: Boolean(accountSid && authToken && from) };
}

/** True when Twilio credentials are present and SMS will actually send. */
export function smsLive(): boolean {
  return config().live;
}

/** UK-friendly E.164 normalisation (07… → +447…; passes a leading + through). */
function toE164(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('0')) return `+44${digits.slice(1)}`;
  return digits;
}

function bookingMessage(input: BookingSubmit, confirmation: BookingConfirmation): string {
  const name = input.firstName?.trim();
  const hi = name ? `Hi ${name}, ` : 'Hi, ';
  return `${hi}your MOVES consultation is booked for ${confirmation.when}. We’ll be in touch with the details. Reply STOP to opt out.`;
}

/**
 * Send the booking-confirmation SMS to the customer. Best-effort: resolves even
 * on failure (logs and swallows) so it can never break a completed booking.
 */
export async function sendBookingSms(
  input: BookingSubmit,
  confirmation: BookingConfirmation,
): Promise<void> {
  const { accountSid, authToken, from, live } = config();
  const to = toE164(input.phone);
  const body = bookingMessage(input, confirmation);

  if (!live) {
    console.info(`[sms] STUB — would send to ${to}: ${body}`);
    return;
  }

  try {
    const res = await fetch(`${TWILIO_API}/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from as string, Body: body }).toString(),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300);
      console.error(`[sms] Twilio send failed (${res.status}): ${detail}`);
    }
  } catch (err) {
    console.error('[sms] Twilio send threw', err);
  }
}
