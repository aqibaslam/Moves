---
name: database-schema-design
description: >
  Postgres modeling standards for the Moves Supabase database — naming, keys,
  cascade rules, timestamps, soft deletes, indexing, enums vs lookup tables,
  N+1 avoidance, and migration discipline.
  Activates when creating or altering tables, adding columns or indexes, writing
  files in supabase/migrations, diagnosing slow queries, or reviewing schema changes.
---

# Database Schema Design

The schema is the contract for `apps/web` and `apps/mobile`. Migrations are
forever, and deployed mobile clients lag weeks behind. Get it right once.

## Core Rules

1. **`snake_case` everywhere. Plural tables, singular columns.** `move_participants`.
2. **Surrogate `uuid` PK named `id`, default `gen_random_uuid()`.** Join tables
   use a composite PK instead.
3. **Every FK gets an explicit `on delete` rule and its own index.** Postgres does
   not index FK columns automatically.
4. **`created_at` + `updated_at` as `timestamptz` on every table.** Never
   `timestamp`, never local time, never set from client code.
5. **Soft delete via `deleted_at timestamptz`** on user-visible tables, filtered
   in the RLS policy — not only in queries.
6. **Index every column an RLS policy references.**
7. **Lookup table over `enum`** for anything a product owner might change.
8. **Migrations are append-only timestamped SQL.** Never edit an applied file.

## Naming

| Thing | Convention | Example |
|---|---|---|
| Table | plural snake_case | `moves`, `org_invitations` |
| FK column | `<singular>_id` | `org_id`, `author_id` |
| Boolean | positive, no verb soup | `published`, `archived` |
| Timestamp | past participle + `_at` | `created_at`, `completed_at` |
| Index | `<table>_<cols>_idx` | `moves_org_id_created_at_idx` |
| Unique | `<table>_<cols>_key` | `memberships_org_id_user_id_key` |
| Function | verb phrase | `is_org_member`, `set_updated_at` |

No `tbl_` prefixes, no CamelCase, no reserved words (`user`, `order`, `group`).

## Primary Keys

```sql
create table public.moves (
  id uuid primary key default gen_random_uuid(),
  ...
);
```

`gen_random_uuid()` (v4) ships in Postgres 13+ core, no extension. UUIDv7 is
time-sortable and better for index locality, but `uuidv7()` is only native in
Postgres 18 — do not pretend v4 sorts. Switch to `default uuidv7()` only once
the instance is confirmed on 18+.

Never `serial`/`bigserial` on client-facing tables: sequential ids leak row
counts and enable enumeration. `bigint generated always as identity` is fine for
internal append-only tables (events, logs) clients never address.

```sql
create table public.move_tags (
  move_id uuid not null references public.moves(id) on delete cascade,
  tag_id  uuid not null references public.tags(id)  on delete cascade,
  primary key (move_id, tag_id)
);
create index move_tags_tag_id_idx on public.move_tags (tag_id);  -- PK covers move_id
```

## Foreign Keys and Cascades

| Rule | Use when |
|---|---|
| `on delete cascade` | Child is meaningless alone: `move_tags`, `memberships`, `comments` |
| `on delete restrict` | Deletion must be blocked: `orgs` with active `projects` |
| `on delete set null` | Optional attribution survives: `assignee_id` |
| `on delete no action` | Never choose deliberately (it is the silent default) |

```sql
create table public.moves (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.orgs(id) on delete cascade,
  owner_id    uuid not null references auth.users(id)  on delete cascade,
  assignee_id uuid          references auth.users(id)  on delete set null,
  title       text not null check (length(trim(title)) between 1 and 200),
  status      text not null default 'draft'
              references public.move_statuses(key) on delete restrict,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index moves_org_id_idx      on public.moves (org_id);
create index moves_owner_id_idx    on public.moves (owner_id);
create index moves_assignee_id_idx on public.moves (assignee_id);
```

Reference `auth.users(id)` for ownership; reference `public.profiles(id)` for
anything you need to join and display.

## Timestamps

```sql
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger moves_set_updated_at before update on public.moves
  for each row execute function public.set_updated_at();
```

Define the function once in the first migration; attach a trigger to every table.

## Soft Deletes

```sql
create index moves_active_idx on public.moves (org_id, created_at desc)
  where deleted_at is null;

create policy "moves_select_active" on public.moves for select to authenticated
  using ( deleted_at is null and public.is_org_member(org_id) );
```

Enforcing it in the policy means a forgotten `.is('deleted_at', null)` in the
Expo app cannot resurrect deleted rows.

```sql
create view public.active_moves
with (security_invoker = on)     -- mandatory, or the view runs as owner and bypasses RLS
as select * from public.moves where deleted_at is null;
```

## Indexing Strategy

**btree** — default. Equality, ranges, sorting, FKs, RLS predicate columns.

```sql
create index moves_org_id_created_at_idx on public.moves (org_id, created_at desc);
```

Composite order: equality columns first, then the range/sort column.
`(org_id, created_at desc)` serves `where org_id = $1 order by created_at desc`
*and* plain `where org_id = $1`. The reverse serves neither.

**partial** — when queries always carry the same filter. Smaller, cheaper writes.

```sql
create index moves_pending_idx on public.moves (org_id, created_at desc)
  where status = 'pending' and deleted_at is null;
```

**gin** — containment on `jsonb`/arrays, full-text, trigram `ILIKE`.

```sql
create index moves_metadata_gin on public.moves using gin (metadata jsonb_path_ops);
-- serves: where metadata @> '{"source":"mobile"}'

create extension if not exists pg_trgm;
create index moves_title_trgm_idx on public.moves using gin (title gin_trgm_ops);
-- serves: where title ilike '%term%'
```

`jsonb_path_ops` is smaller and faster than default `jsonb_ops` when you only need `@>`.

**unique** — express business rules as constraints, not app checks.

```sql
create unique index org_invitations_org_email_key
  on public.org_invitations (org_id, lower(email)) where accepted_at is null;
```

Do not index standalone low-cardinality booleans, or columns never used in
`where`/`join`/`order by`. Every index taxes every write. Justify with
`explain (analyze, buffers)`.

## Avoiding N+1

```ts
// GOOD — one round trip via embedded resources
const { data } = await supabase.from('moves').select(`
    id, title, status, created_at,
    owner:profiles!moves_owner_id_fkey ( id, full_name, avatar_url ),
    tags:move_tags ( tag:tags ( id, name ) ),
    comment_count:comments(count)
  `).eq('org_id', orgId).order('created_at', { ascending: false }).limit(20)

// BAD — N+1
for (const m of moves) await supabase.from('profiles').select('*').eq('id', m.owner_id)
```

When an embed needs aggregation, write a function and `.rpc()` it. Mark it
`stable` and leave it `security invoker` so RLS still applies.

```sql
create or replace function public.org_move_summary(target_org uuid)
returns table (status text, total bigint)
language sql stable as $$
  select m.status, count(*) from public.moves m
  where m.org_id = target_org and m.deleted_at is null group by m.status;
$$;
```

## Enum vs Lookup Table

Use a Postgres `enum` only for a closed domain set that will never change.
Adding a value is easy; **removing or renaming one requires rewriting the type
and every dependent column**.

```sql
create type public.visibility as enum ('private', 'org', 'public');
```

Any status list a product owner will edit goes in a lookup table:

```sql
create table public.move_statuses (
  key text primary key, label text not null,
  sort_order int not null default 0, is_terminal boolean not null default false
);
insert into public.move_statuses (key, label, sort_order)
values ('draft','Draft',10), ('active','Active',20), ('done','Done',30);

alter table public.moves add constraint moves_status_fkey
  foreign key (status) references public.move_statuses(key) on delete restrict;
```

Lookup tables need RLS too — public read, no client write. For a fixed two- or
three-value set, a `text` column with a `check` constraint is the lightest
correct option.

## Migration Discipline

```
supabase/migrations/
  20260727120000_init_extensions_and_helpers.sql
  20260727120500_create_orgs_and_memberships.sql
  20260727121000_create_moves.sql
  20260727121500_rls_moves.sql
```

```bash
supabase migration new create_moves      # timestamped file
supabase db reset                        # replay all migrations + seed.sql
supabase db diff -f add_move_priority    # capture Studio changes into a migration
supabase db push                         # apply to the linked remote
supabase gen types typescript --local > packages/types/src/supabase.ts
```

- **One logical change per file.** A table and its RLS may share a file;
  unrelated tables may not.
- **Never edit a pushed or merged migration.** Write a new one.
- **Every migration must replay cleanly from scratch** via `supabase db reset`.
- **Destructive changes are multi-step**: add column → backfill → switch reads →
  drop in a *later* migration. The deployed mobile app still reads the old column.
- **Regenerate and commit types after every schema change.**
- **Keep `supabase/seed.sql` runnable** — it is the fixture set for integration
  and RLS tests.

## Red Flags

- Table with no `created_at`/`updated_at`, or `timestamp` instead of `timestamptz`.
- FK with no `on delete` clause, or no index on the FK column.
- `serial`/`bigserial` PKs on client-facing tables.
- CamelCase or singular table names, `tbl_` prefixes, reserved-word identifiers.
- An RLS policy referencing an unindexed column.
- A view without `with (security_invoker = on)`.
- `text` status columns with no `check` or FK constraint.
- `jsonb` holding fields that are always present and always queried — those are columns.
- Hard `delete` where a soft delete was specified.
- Any edit to an already-applied migration file.
- Studio changes not captured via `supabase db diff`.
- `packages/types/src/supabase.ts` out of sync with `supabase/migrations`.
- A loop issuing one `supabase.from(...)` query per item.
- New indexes with no `explain analyze` justification.
