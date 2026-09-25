'use server';

import config from '@payload-config';
import { after } from 'next/server';
import { getPayload, ValidationError } from 'payload';
import { sendEmail, subscribedHtml } from '@/lib/email';

export type SubscribeResult = { ok: true } | { ok: false; error: string };

const INVALID_EMAIL = 'Please enter a valid email address.';

/**
 * Mirrors Payload's `email` field validation so malformed addresses are caught
 * here with a clear message instead of failing inside `payload.create` and
 * surfacing as a generic error. Rejects: a leading/trailing dot or consecutive
 * dots in the local part, quotes, spaces, domain labels that start/end with a
 * hyphen, and a TLD shorter than two letters.
 */
const EMAIL_RE =
  /^(?!.*\.\.)[\w!#$%&'*+/=?^`{|}~-](?:[\w!#$%&'*+/=?^`{|}~.-]*[\w!#$%&'*+/=?^`{|}~-])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i;

/** True when a Payload ValidationError was raised for the `email` field. */
function isEmailValidationError(err: unknown): boolean {
  return err instanceof ValidationError && err.data.errors.some((e) => e.path === 'email');
}

/**
 * Newsletter sign-up: record the subscriber and send a confirmation email.
 * No magic link — the confirmation email contains no link back to the site,
 * and the browser shows the "You're subscribed" screen on success.
 */
export async function subscribe(emailRaw: string): Promise<SubscribeResult> {
  const email = emailRaw?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: INVALID_EMAIL };

  const payload = await getPayload({ config });

  try {
    const existing = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, overrideAccess: true });
    if (existing.docs[0]) {
      await payload.update({
        collection: 'customers',
        id: existing.docs[0].id,
        overrideAccess: true,
        data: { signupSource: 'email' },
      });
    } else {
      await payload.create({
        collection: 'customers',
        overrideAccess: true,
        data: {
          name: email.split('@')[0],
          email,
          verified: false,
          signupSource: 'email',
        },
      });
    }
  } catch (err) {
    if (isEmailValidationError(err)) return { ok: false, error: INVALID_EMAIL };
    console.error('[subscribe] could not save subscriber', err);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }

  // Send the confirmation AFTER the response is flushed. The subscriber is
  // already saved, so the browser shows "You're subscribed" immediately
  // instead of waiting on the Resend API round-trip. A delivery hiccup never
  // blocks or fails the signup.
  after(async () => {
    try {
      await sendEmail(email, 'You\'re subscribed · MOVES', subscribedHtml());
    } catch (err) {
      console.error('[subscribe] confirmation email failed', err);
    }
  });

  return { ok: true };
}
