alter table public.wallet_bookings
  add column if not exists google_last_checked_at timestamptz,
  add column if not exists google_check_count integer not null default 0;

alter table public.wallet_bookings
  add constraint wallet_bookings_google_check_count_nonnegative
  check (google_check_count >= 0) not valid;

alter table public.wallet_bookings
  validate constraint wallet_bookings_google_check_count_nonnegative;

create index if not exists wallet_bookings_google_pending_check_idx
  on public.wallet_bookings (google_wallet_status, google_last_checked_at, google_clicked_at)
  where google_wallet_status = 'clicked';
