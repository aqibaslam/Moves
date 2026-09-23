'use server';

import { randomBytes } from 'node:crypto';
import config from '@payload-config';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import { emailEnabled, magicLinkHtml, sendEmail } from '@/lib/email';

export type SignupResult =
  | { ok: true; emailed: boolean; devLink?: string }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Start a passwordless sign-up: create/find the customer, email a one-time link. */
export async function requestSignupLink(emailRaw: string): Promise<SignupResult> {
  const email = emailRaw?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: 'Enter a valid email address.' };

  const payload = await getPayload({ config });
  const token = randomBytes(24).toString('hex');
  const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min

  try {
    const existing = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, overrideAccess: true });
    if (existing.docs[0]) {
      await payload.update({
        collection: 'customers',
        id: existing.docs[0].id,
        overrideAccess: true,
        data: { signupToken: token, signupTokenExpiry: expiry, signupSource: 'email' },
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
          signupToken: token,
          signupTokenExpiry: expiry,
        },
      });
    }
  } catch (err) {
    console.error('[signup] could not create customer', err);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }

  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host = h.get('host');
  const link = `${proto}://${host}/signup/verify?token=${token}`;

  const { sent } = await sendEmail(email, 'Confirm your email · Moves', magicLinkHtml(link));

  if (!sent && !emailEnabled()) {
    console.log('[signup] dev magic link:', link);
    return { ok: true, emailed: false, devLink: link };
  }
  return { ok: true, emailed: sent };
}
