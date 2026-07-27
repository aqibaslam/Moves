---
name: supabase-architect
description: >
  Designs and implements Supabase as the complete backend for the Moves monorepo —
  schema, Row Level Security, auth, storage, realtime, and Edge Functions.
  Activates when creating Supabase clients, writing RLS policies, wiring auth in
  apps/web (Next.js App Router) or apps/mobile (Expo), configuring buckets, adding
  realtime subscriptions, or authoring supabase/functions.
---

# Supabase Architect

Supabase is the entire backend. There is no separate API server. The database
*is* the authorization layer — RLS is not hardening, it is the product.

## Core Rules

1. **RLS on every table in `public`.** A table without it is a public leak.
2. **Use `@supabase/ssr`** (`createServerClient`/`createBrowserClient`).
   `@supabase/auth-helpers-nextjs` is deprecated — never install it.
3. **Only `getAll`/`setAll` cookie methods.** `get`/`set`/`remove` is gone in v0.5+.
4. **`cookies()` is async.** Always `await cookies()`.
5. **Never `getSession()` for a server authorization decision** — it reads an
   unverified cookie. Use `getUser()`, which revalidates the JWT.
6. **Never a module-level server client.** Create per request or leak sessions.
7. **Wrap `auth.uid()` in a subquery**: `(select auth.uid())`. Postgres caches it
   as an initplan instead of calling it per row.
8. **Service-role key is server-only.** Never `NEXT_PUBLIC_*`, never in Expo.

## Client Creation

```ts
// apps/web/lib/supabase/client.ts — browser, "use client"
import { createBrowserClient } from '@supabase/ssr'
export const createClient = () => createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
```

```ts
// apps/web/lib/supabase/server.ts — Server Components, Actions, Route Handlers
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()                    // async — must await
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(toSet) {
          try { toSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)) }
          catch { /* Server Component: cookies read-only. Middleware refreshes. */ }
        },
    } })
}

// Usage: const supabase = await createClient()
//        const { data: { user } } = await supabase.auth.getUser()
```

```ts
// apps/mobile/lib/supabase.ts
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { AppState } from 'react-native'

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true,
            detectSessionInUrl: false } })   // no URL session in RN

AppState.addEventListener('change', (s) =>
  s === 'active' ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh())
```

AsyncStorage is unencrypted — use `expo-secure-store` if tokens must survive
device compromise.

## Row Level Security — The Critical Section

**One policy per operation per role. Never `for all`** — you lose the split
between `using` (which rows are visible/targetable) and `with check` (which rows
may be written). `for all` with only `using` lets a user rewrite `owner_id` and
hand the row to someone else.

### Pattern 1 — Owner-only

```sql
alter table public.moves enable row level security;

create policy "moves_select_own" on public.moves for select to authenticated
  using ( (select auth.uid()) = owner_id );

create policy "moves_insert_own" on public.moves for insert to authenticated
  with check ( (select auth.uid()) = owner_id );

create policy "moves_update_own" on public.moves for update to authenticated
  using      ( (select auth.uid()) = owner_id )
  with check ( (select auth.uid()) = owner_id );   -- blocks owner reassignment

create policy "moves_delete_own" on public.moves for delete to authenticated
  using ( (select auth.uid()) = owner_id );

create index moves_owner_id_idx on public.moves (owner_id);  -- else every read seq-scans
```

### Pattern 2 — Team / org membership

Never query the protected table inside its own policy — that recurses. Keep
membership in its own table, read via a `security definer` helper.

```sql
create table public.memberships (
  org_id  uuid not null references public.orgs(id)  on delete cascade,
  user_id uuid not null references auth.users(id)   on delete cascade,
  role    text not null default 'member' check (role in ('owner','admin','member')),
  primary key (org_id, user_id)
);
create index memberships_user_id_idx on public.memberships (user_id);

create or replace function public.has_org_role(target_org uuid, roles text[])
returns boolean
language sql security definer set search_path = '' stable   -- search_path is mandatory
as $$
  select exists (select 1 from public.memberships m
                 where m.org_id = target_org
                   and m.user_id = (select auth.uid())
                   and m.role = any(roles));
$$;

create or replace function public.is_org_member(target_org uuid)
returns boolean language sql security definer set search_path = '' stable
as $$ select public.has_org_role(target_org, array['owner','admin','member']); $$;

alter table public.projects enable row level security;

create policy "projects_select_members" on public.projects for select to authenticated
  using ( public.is_org_member(org_id) );
create policy "projects_insert_members" on public.projects for insert to authenticated
  with check ( public.is_org_member(org_id) );
create policy "projects_update_admins" on public.projects for update to authenticated
  using      ( public.has_org_role(org_id, array['owner','admin']) )
  with check ( public.has_org_role(org_id, array['owner','admin']) );
create policy "projects_delete_owners" on public.projects for delete to authenticated
  using ( public.has_org_role(org_id, array['owner']) );

-- Guard memberships itself, or a member can self-promote.
alter table public.memberships enable row level security;
create policy "memberships_read_same_org" on public.memberships for select to authenticated
  using ( public.is_org_member(org_id) );
create policy "memberships_write_admins" on public.memberships for insert to authenticated
  with check ( public.has_org_role(org_id, array['owner','admin']) );
```

### Pattern 3 — Public read, restricted write

```sql
alter table public.move_templates enable row level security;

create policy "templates_public_read" on public.move_templates for select
  to anon, authenticated using ( published = true and deleted_at is null );
create policy "templates_author_drafts" on public.move_templates for select
  to authenticated using ( (select auth.uid()) = author_id );
create policy "templates_author_write" on public.move_templates for insert
  to authenticated with check ( (select auth.uid()) = author_id );

create index templates_published_idx on public.move_templates (created_at desc)
  where published = true and deleted_at is null;   -- match the policy predicate
```

### Never

```sql
create policy "r" on public.moves for select using (true);              -- exposed to anon
create policy "o" on public.moves for all using (auth.uid() = owner_id); -- no with check
```

## Auth

```ts
await supabase.auth.signInWithPassword({ email, password })

// Magic link (web)
await supabase.auth.signInWithOtp({ email,
  options: { emailRedirectTo: `${origin}/auth/callback` } })

// OTP code (Expo — no deep link needed)
await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
await supabase.auth.verifyOtp({ email, token: code, type: 'email' })

await supabase.auth.signInWithOAuth({ provider: 'google',
  options: { redirectTo: `${origin}/auth/callback?next=/dashboard` } })
```

```ts
// apps/web/app/auth/callback/route.ts — PKCE exchange
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
```

Mirror `auth.users` into `public.profiles` with an `after insert` trigger
(`security definer`, `set search_path = ''`) and query `profiles`, never
`auth.users`. `raw_user_meta_data` is user-writable — never store roles there.

## Storage

Private buckets. Path `{bucket}/{user_id}/{file}` so policies key off segment 1.

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('move-media','move-media', false, 10485760,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "move_media_read_own" on storage.objects for select to authenticated
  using ( bucket_id = 'move-media'
          and (storage.foldername(name))[1] = (select auth.uid())::text );
create policy "move_media_upload_own" on storage.objects for insert to authenticated
  with check ( bucket_id = 'move-media'
               and (storage.foldername(name))[1] = (select auth.uid())::text );
```

```ts
const { data } = await supabase.storage.from('move-media')
  .createSignedUrl(`${user.id}/${file}`, 3600)
```

Never make a bucket public to avoid signing.

## Realtime

```sql
alter publication supabase_realtime add table public.moves;
alter table public.moves replica identity full;   -- for UPDATE/DELETE payloads
```

```ts
useEffect(() => {
  const supabase = createClient()
  const channel = supabase.channel(`moves:org:${orgId}`)
    .on('postgres_changes',
        { event: '*', schema: 'public', table: 'moves', filter: `org_id=eq.${orgId}` },
        () => router.refresh())
    .subscribe()
  return () => { supabase.removeChannel(channel) }   // always clean up
}, [orgId])
```

`filter` is convenience, not security. RLS is the boundary.

## Edge Functions

Only for work a route handler cannot do: webhooks that must not hit Vercel,
cron, or logic Expo needs without a web deploy.

```ts
// supabase/functions/process-move/index.ts
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Unauthorized', { status: 401 })

  // Forward the caller's JWT so RLS applies to this client.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data, error } = await supabase.from('moves')
    .insert({ owner_id: user.id, ...(await req.json()) }).select().single()
  return error ? Response.json({ error: error.message }, { status: 400 })
               : Response.json({ data }, { status: 201 })
})
```

Verify webhook signatures first. Set `verify_jwt = false` in `config.toml` only
for genuinely public webhook endpoints.

## Red Flags

- Any `public` table without `enable row level security`.
- `using (true)` not deliberately scoped `to authenticated`.
- `for all` policies, or `for update` without a `with check`.
- Bare `auth.uid()` instead of `(select auth.uid())` in a policy.
- A policy querying the table it protects (recursion).
- `security definer` function missing `set search_path = ''`.
- `@supabase/auth-helpers-nextjs` in any `package.json`.
- `get`/`set`/`remove` cookie handlers instead of `getAll`/`setAll`.
- `cookies()`, `params`, or `searchParams` used without `await`.
- `getSession()` used for a server-side authorization decision.
- A server client created at module scope and shared across requests.
- `SUPABASE_SERVICE_ROLE_KEY` in a client component, `NEXT_PUBLIC_*`, or `apps/mobile`.
- Public buckets holding user-scoped content; policy columns left unindexed.
- Realtime channels with no `removeChannel` cleanup.
- Roles read from `user_metadata`; `auth.users` queried directly from app code.
