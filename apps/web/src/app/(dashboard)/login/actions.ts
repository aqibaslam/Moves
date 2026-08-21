'use server';

import type { Route } from 'next';
import config from '@payload-config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import { AUTH_COOKIE } from '../lib/auth';

export type SignInState = { error?: string };

/** Only same-origin absolute paths — blocks "//evil.com" and full URLs. */
function safePath(raw: string): string {
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/admin';
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = safePath(String(formData.get('next') ?? '/admin'));

  if (!email || !password) {
    return { error: 'Enter both your email and password.' };
  }

  const payload = await getPayload({ config });

  let token: string | undefined;
  try {
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    });
    token = result.token;
  } catch {
    // Deliberately vague: distinguishing "no such user" from "wrong password"
    // hands an attacker a way to enumerate valid admin emails. Payload also
    // locks an account after repeated failures, which this preserves.
    return { error: 'Those details don’t match an admin account.' };
  }

  if (!token) {
    return { error: 'Sign-in failed. Please try again.' };
  }

  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  redirect(next as Route);
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  redirect('/login');
}
