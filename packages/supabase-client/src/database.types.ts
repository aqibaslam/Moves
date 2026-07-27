/**
 * Generated Supabase types — DO NOT EDIT BY HAND.
 *
 * Regenerate after every migration:
 *   pnpm db:types              (from local dev DB, requires `supabase start`)
 *
 * Or against the hosted project:
 *   supabase gen types typescript --project-id $SUPABASE_PROJECT_REF \
 *     > packages/supabase-client/src/database.types.ts
 *
 * The placeholder below keeps the workspace type-checking before the first
 * migration exists. It is replaced wholesale by the generator.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
