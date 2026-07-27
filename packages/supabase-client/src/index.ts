/**
 * Shared, platform-neutral exports only.
 *
 * Import the platform clients from their own entry points so a native bundle
 * never pulls in next/headers and a browser bundle never pulls in the
 * service-role client:
 *
 *   @moves/supabase-client/browser  → Client Components
 *   @moves/supabase-client/server   → Server Components, Actions, Route Handlers
 *   @moves/supabase-client/admin    → server-only, bypasses RLS
 *   @moves/supabase-client/native   → Expo
 */
export type { Database, Json } from './database.types';
export type { Session, User, SupabaseClient } from '@supabase/supabase-js';
