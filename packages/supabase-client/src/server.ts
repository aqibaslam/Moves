/**
 * Server-side Supabase client for apps/web.
 *
 * Next.js 15: cookies() is async, so this factory is async too — always await it.
 *
 *   const supabase = await createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *
 * Always use getUser(), never getSession(), on the server. getSession() reads
 * the cookie without validating it against the auth server, so it is trivially
 * spoofable. getUser() revalidates.
 */
import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

export async function createClient() {
  const cookieStore = await cookies();

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      } catch {
        // Called from a Server Component, which cannot set cookies.
        // Safe to ignore as long as the proxy is refreshing the session —
        // see apps/web/src/proxy.ts.
      }
    },
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods },
  );
}
