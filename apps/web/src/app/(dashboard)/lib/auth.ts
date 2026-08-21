/**
 * Admin auth for the Moves dashboard — Payload's `users` collection.
 *
 * The dashboard and the CMS at /admin share one session: both read the
 * `payload-token` cookie, so signing into either signs you into both.
 *
 * payload.auth() verifies the token against the database on every call. There
 * is no "trust the cookie" path here — an expired or forged token yields null.
 */
import 'server-only';
import config from '@payload-config';
import { headers as nextHeaders } from 'next/headers';
import { getPayload } from 'payload';
import type { User } from '@/payload-types';

/** Payload's default cookie name (no cookiePrefix is configured). */
export const AUTH_COOKIE = 'payload-token';

/** The verified Payload user, or null. Pass this to local-API calls. */
export async function getPayloadUser(): Promise<User | null> {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  // payload.auth is typed across every auth-enabled collection; this project
  // has only `users`, but narrow explicitly rather than assuming.
  return user && user.collection === 'users' ? (user as User) : null;
}

export type AdminUser = {
  email: string;
  name: string | null;
};

export async function getAdminUser(): Promise<AdminUser | null> {
  const user = await getPayloadUser();
  return user ? { email: user.email, name: user.name ?? null } : null;
}
