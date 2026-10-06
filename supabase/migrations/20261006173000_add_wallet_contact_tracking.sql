-- Provider-specific Wallet state supports honest CRM qualification:
-- clicked (intent), added (provider-confirmed), and removed.

alter table public.wallet_bookings
  add column apple_wallet_status text not null default 'not_started',
  add column apple_clicked_at timestamptz,
  add column apple_added_at timestamptz,
  add column apple_removed_at timestamptz,
  add column google_wallet_status text not null default 'not_started',
  add column google_clicked_at timestamptz,
  add column google_added_at timestamptz,
  add column google_removed_at timestamptz;

alter table public.wallet_bookings
  add constraint wallet_bookings_apple_status_check
    check (apple_wallet_status in ('not_started', 'clicked', 'added', 'removed')),
  add constraint wallet_bookings_google_status_check
    check (google_wallet_status in ('not_started', 'clicked', 'added', 'removed'));

create index wallet_bookings_google_pending_idx
  on public.wallet_bookings (google_clicked_at)
  where google_wallet_status = 'clicked';
