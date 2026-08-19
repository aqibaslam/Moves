'use server';

import type { Route } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@moves/supabase-client/server';
import {
  PREVIEW_COOKIE,
  PREVIEW_TOKEN,
  checkPreviewCredentials,
  isPreviewMode,
  isSupabaseConfigured,
} from '../lib/auth';

export type SignInState = { error?: string };

/** Only same-origin absolute paths — blocks "//evil.com" and full URLs. */
function safePath(raw: string): string {
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard';
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = safePath(String(formData.get('next') ?? '/dashboard'));

  if (!email || !password) {
    return { error: 'Enter both your email and password.' };
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Deliberately vague: distinguishing "no such user" from "wrong password"
      // hands an attacker a way to enumerate valid admin emails.
      return { error: 'Those details don’t match an admin account.' };
    }
  } else if (isPreviewMode()) {
    if (!checkPreviewCredentials(email, password)) {
      return { error: 'Those details don’t match an admin account.' };
    }

    const store = await cookies();
    store.set(PREVIEW_COOKIE, PREVIEW_TOKEN, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
      secure: process.env.NODE_ENV === 'production',
    });
  } else {
    return { error: 'Sign-in is unavailable: Supabase is not configured.' };
  }

  redirect(next as Route);
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  const store = await cookies();
  store.delete(PREVIEW_COOKIE);

  redirect('/login');
}
