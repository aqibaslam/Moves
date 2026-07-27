/**
 * Service-role Supabase client. BYPASSES ROW LEVEL SECURITY.
 *
 * ⚠  SERVER ONLY. Never import this from a Client Component, from apps/mobile,
 *    or from anything that ends up in a browser or app bundle. Leaking the
 *    service-role key hands an attacker your entire database.
 *
 * Reach for this only when you genuinely need to act outside a user's
 * permissions: webhooks, cron jobs, admin tooling, seeding. If a normal
 * user request can do the job under RLS, use ./server instead.
 */
import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. This client cannot be used without it.',
    );
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}
