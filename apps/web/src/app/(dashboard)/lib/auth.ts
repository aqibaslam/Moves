/**
 * Admin auth for the Moves dashboard.
 *
 * Real path: Supabase email + password. `getUser()` — never `getSession()` —
 * because getSession trusts the cookie without revalidating it.
 *
 * Preview path: this repo has no Supabase project wired yet (.env.local is
 * still placeholders). To keep the dashboard reviewable before then, a
 * signed-out visitor may enter a local preview password instead. It is
 * hard-disabled the moment either Supabase is configured or NODE_ENV is
 * production, so it cannot survive to a deploy.
 *
 * DELETE `PREVIEW_*` and `previewSignIn` once Supabase is live.
 */
import 'server-only';
import { cookies } from 'next/headers';
import { createClient } from '@moves/supabase-client/server';

export const PREVIEW_COOKIE = 'moves_admin_preview';
export const PREVIEW_TOKEN = 'preview';

/** Preview password. Local-only — see the file header. */
const PREVIEW_PASSWORD = process.env.ADMIN_PREVIEW_PASSWORD ?? 'moves-admin';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * True only when the dashboard may fall back to the preview password:
 * no Supabase project AND not production. Both conditions, always.
 */
export function isPreviewMode(): boolean {
  return !isSupabaseConfigured() && process.env.NODE_ENV !== 'production';
}

export function checkPreviewPassword(password: string): boolean {
  return isPreviewMode() && password === PREVIEW_PASSWORD;
}

export type AdminUser = {
  email: string;
  /** Preview sessions render a visible banner so they are never mistaken for real auth. */
  preview: boolean;
};

/**
 * The signed-in admin, or null. Read this in a layout/page to gate rendering —
 * the proxy redirect is the first line of defence, this is the second.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.email ? { email: user.email, preview: false } : null;
  }

  if (!isPreviewMode()) return null;

  const store = await cookies();
  return store.get(PREVIEW_COOKIE)?.value === PREVIEW_TOKEN
    ? { email: 'preview@moves.local', preview: true }
    : null;
}
