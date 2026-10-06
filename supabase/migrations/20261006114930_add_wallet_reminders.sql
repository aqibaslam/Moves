-- Durable server-only state for Apple/Google Wallet consultation reminders.
-- Browser roles have no grants; the website backend uses a Supabase secret key.

create table public.wallet_bookings (
  appointment_id text primary key,
  serial text not null unique,
  contact_id text,
  first_name text not null,
  last_name text not null default '',
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text not null default 'Europe/London',
  meeting_url text,
  status text not null default 'confirmed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index wallet_bookings_start_at_idx on public.wallet_bookings (start_at);

create table public.wallet_devices (
  id bigint generated always as identity primary key,
  serial text not null references public.wallet_bookings(serial) on delete cascade,
  device_id text not null,
  pass_type text not null,
  push_token text,
  removed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (device_id, pass_type, serial)
);

create index wallet_devices_active_serial_idx
  on public.wallet_devices (serial)
  where removed_at is null;

create table public.wallet_events (
  id bigint generated always as identity primary key,
  appointment_id text references public.wallet_bookings(appointment_id) on delete cascade,
  event text not null,
  platform text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index wallet_events_appointment_event_idx
  on public.wallet_events (appointment_id, event);

alter table public.wallet_bookings enable row level security;
alter table public.wallet_devices enable row level security;
alter table public.wallet_events enable row level security;

revoke all on table public.wallet_bookings from anon, authenticated;
revoke all on table public.wallet_devices from anon, authenticated;
revoke all on table public.wallet_events from anon, authenticated;
revoke all on sequence public.wallet_devices_id_seq from anon, authenticated;
revoke all on sequence public.wallet_events_id_seq from anon, authenticated;

grant select, insert, update, delete on table public.wallet_bookings to service_role;
grant select, insert, update, delete on table public.wallet_devices to service_role;
grant select, insert, update, delete on table public.wallet_events to service_role;
grant usage, select on sequence public.wallet_devices_id_seq to service_role;
grant usage, select on sequence public.wallet_events_id_seq to service_role;
