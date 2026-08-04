'use server';

import type { Route } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GATE_COOKIE, GATE_TOKEN, type UnlockState } from './gate';

/** Shared password for the launch gate. Override with SITE_PASSWORD if needed. */
const PASSWORD = process.env.SITE_PASSWORD ?? 'Moves';

function safePath(raw: string): string {
  // only allow same-origin absolute paths (block "//evil.com" and full URLs)
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
}

export async function unlock(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const password = String(formData.get('password') ?? '');

  if (password !== PASSWORD) {
    return { error: 'That password isn’t right. Please try again.' };
  }

  const store = await cookies();
  store.set(GATE_COOKIE, GATE_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
  });

  redirect(safePath(String(formData.get('from') ?? '/')) as Route);
}
