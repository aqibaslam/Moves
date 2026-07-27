/**
 * Browser-side Supabase client for apps/web.
 *
 * Use ONLY in Client Components ("use client"). For Server Components,
 * Server Actions, and Route Handlers use ./server instead — they need
 * cookie access to read the session.
 */
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
