-- Moves — initial schema.
--
-- Establishes the pattern every later migration should follow:
--   1. create the table
--   2. enable RLS in the SAME migration
--   3. write explicit policies per operation
--   4. add the updated_at trigger
--
-- A table shipped without RLS is a public table. There are no exceptions.

-- ── updated_at trigger ────────────────────────────────────────
-- Shared by every table with an updated_at column.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ──────────────────────────────────────────────────
-- Mirrors auth.users. Never write app data into auth.users directly.

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint username_length check (char_length(username) between 3 and 32),
  constraint username_format check (username ~ '^[a-z0-9_]+$')
);

comment on table public.profiles is
  'Public profile data. One row per auth.users row, created automatically on signup.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────

alter table public.profiles enable row level security;

-- Profiles are publicly readable. If they should not be, change this policy —
-- do not rely on the client simply not querying them.
create policy "profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

-- (select auth.uid()) rather than bare auth.uid(): the subquery form is
-- evaluated once per statement instead of once per row. On large tables the
-- difference is orders of magnitude.
create policy "users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Deliberately no delete policy: profiles are removed by the cascade from
-- auth.users, not by users directly.

-- ── auto-create profile on signup ─────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── indexes ───────────────────────────────────────────────────
-- id is already indexed by the primary key; username by its unique constraint.
-- Add indexes here as real query patterns emerge — not speculatively.
