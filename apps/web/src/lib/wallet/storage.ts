import 'server-only';

import { createClient } from '@supabase/supabase-js';

export interface WalletBookingRow {
  appointment_id: string;
  serial: string;
  contact_id: string | null;
  first_name: string;
  last_name: string;
  start_at: string;
  end_at: string;
  timezone: string;
  meeting_url: string | null;
  status: string;
  apple_wallet_status: WalletStatus;
  apple_clicked_at: string | null;
  apple_added_at: string | null;
  apple_removed_at: string | null;
  google_wallet_status: WalletStatus;
  google_clicked_at: string | null;
  google_added_at: string | null;
  google_removed_at: string | null;
  google_last_checked_at: string | null;
  google_check_count: number;
  created_at: string;
  updated_at: string;
}

export interface WalletDeviceRow {
  id: number;
  serial: string;
  device_id: string;
  pass_type: string;
  push_token: string | null;
  removed_at: string | null;
  created_at: string;
  updated_at: string;
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Wallet storage is not configured');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}

export function walletStorageConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function recordWalletBooking(input: {
  appointmentId: string;
  serial: string;
  contactId?: string | null;
  firstName: string;
  lastName: string;
  startISO: string;
  endISO: string;
  timezone: string;
  meetingUrl: string | null;
}): Promise<void> {
  const { error } = await client().from('wallet_bookings').upsert(
    {
      appointment_id: input.appointmentId,
      serial: input.serial,
      contact_id: input.contactId ?? null,
      first_name: input.firstName,
      last_name: input.lastName,
      start_at: input.startISO,
      end_at: input.endISO,
      timezone: input.timezone,
      meeting_url: input.meetingUrl,
      status: 'confirmed',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'appointment_id' },
  );
  if (error) throw new Error(`Wallet booking write failed: ${error.message}`);
}

export async function getWalletBookingBySerial(serial: string): Promise<WalletBookingRow | null> {
  const { data, error } = await client()
    .from('wallet_bookings')
    .select('*')
    .eq('serial', serial)
    .maybeSingle();
  if (error) throw new Error(`Wallet booking read failed: ${error.message}`);
  return data as WalletBookingRow | null;
}

export async function dueWalletBookings(from: string, to: string): Promise<WalletBookingRow[]> {
  const { data, error } = await client()
    .from('wallet_bookings')
    .select('*')
    .gte('start_at', from)
    .lte('start_at', to)
    .eq('status', 'confirmed')
    .limit(200);
  if (error) throw new Error(`Wallet reminder query failed: ${error.message}`);
  return data as WalletBookingRow[];
}

export async function updateWalletBooking(
  appointmentId: string,
  patch: Partial<Omit<WalletBookingRow, 'appointment_id' | 'created_at'>>,
): Promise<void> {
  const { error } = await client()
    .from('wallet_bookings')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('appointment_id', appointmentId);
  if (error) throw new Error(`Wallet booking update failed: ${error.message}`);
}

export type WalletPlatform = 'apple' | 'google';
export type WalletStatus = 'not_started' | 'clicked' | 'added' | 'removed';

/**
 * Keep the latest provider state on the booking row so launch reporting and
 * the Google confirmation poll never need to infer state from raw events.
 */
export async function updateWalletStatus(
  appointmentId: string,
  platform: WalletPlatform,
  status: WalletStatus,
): Promise<void> {
  const now = new Date().toISOString();
  const patch: Record<string, string> = {
    [`${platform}_wallet_status`]: status,
    [`${platform}_${status}_at`]: now,
    updated_at: now,
  };
  const { error } = await client()
    .from('wallet_bookings')
    .update(patch)
    .eq('appointment_id', appointmentId);
  if (error) throw new Error(`Wallet status update failed: ${error.message}`);
}

export async function pendingGoogleWalletBookings(limit = 50): Promise<WalletBookingRow[]> {
  const { data, error } = await client()
    .from('wallet_bookings')
    .select('*')
    .eq('google_wallet_status', 'clicked')
    .gte('google_clicked_at', new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString())
    .order('google_clicked_at', { ascending: true })
    .limit(200);
  if (error) throw new Error(`Pending Google Wallet query failed: ${error.message}`);
  const now = Date.now();
  return (data as WalletBookingRow[])
    .filter((row) => {
      if (!row.google_last_checked_at) return true;
      const interval = row.google_check_count < 3 ? 60_000 : row.google_check_count < 12 ? 5 * 60_000 : 30 * 60_000;
      return now - Date.parse(row.google_last_checked_at) >= interval;
    })
    .slice(0, limit);
}

export async function markGoogleWalletChecked(row: WalletBookingRow): Promise<void> {
  const { error } = await client()
    .from('wallet_bookings')
    .update({
      google_last_checked_at: new Date().toISOString(),
      google_check_count: (row.google_check_count ?? 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('appointment_id', row.appointment_id);
  if (error) throw new Error(`Google Wallet check update failed: ${error.message}`);
}

export async function upsertWalletDevice(input: {
  serial: string;
  deviceId: string;
  passType: string;
  pushToken: string | null;
}): Promise<boolean> {
  const db = client();
  const { data: existing, error: readError } = await db
    .from('wallet_devices')
    .select('*')
    .eq('serial', input.serial)
    .eq('device_id', input.deviceId)
    .eq('pass_type', input.passType)
    .maybeSingle();
  if (readError) throw new Error(`Wallet device read failed: ${readError.message}`);
  const typedExisting = existing as WalletDeviceRow | null;
  const wasActive = Boolean(typedExisting && !typedExisting.removed_at);
  const { error } = await db.from('wallet_devices').upsert(
    {
      serial: input.serial,
      device_id: input.deviceId,
      pass_type: input.passType,
      push_token: input.pushToken ?? typedExisting?.push_token ?? null,
      removed_at: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'device_id,pass_type,serial' },
  );
  if (error) throw new Error(`Wallet device write failed: ${error.message}`);
  return wasActive;
}

export async function removeWalletDevice(serial: string, deviceId: string, passType: string) {
  const { error } = await client()
    .from('wallet_devices')
    .update({ removed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('serial', serial)
    .eq('device_id', deviceId)
    .eq('pass_type', passType);
  if (error) throw new Error(`Wallet device removal failed: ${error.message}`);
}

export async function activeWalletDevices(serial: string): Promise<WalletDeviceRow[]> {
  const { data, error } = await client()
    .from('wallet_devices')
    .select('*')
    .eq('serial', serial)
    .is('removed_at', null);
  if (error) throw new Error(`Wallet device query failed: ${error.message}`);
  return data as WalletDeviceRow[];
}

export async function deviceSerials(deviceId: string, passType: string): Promise<string[]> {
  const { data, error } = await client()
    .from('wallet_devices')
    .select('serial')
    .eq('device_id', deviceId)
    .eq('pass_type', passType)
    .is('removed_at', null);
  if (error) throw new Error(`Wallet device serial query failed: ${error.message}`);
  return (data as Array<{ serial: string }>).map((row) => row.serial);
}

export async function changedSerials(serials: string[], since: Date): Promise<string[]> {
  if (!serials.length) return [];
  const { data, error } = await client()
    .from('wallet_bookings')
    .select('serial')
    .in('serial', serials)
    .gt('updated_at', since.toISOString());
  if (error) throw new Error(`Wallet changes query failed: ${error.message}`);
  return (data as Array<{ serial: string }>).map((row) => row.serial);
}

export async function walletEventExists(appointmentId: string, event: string): Promise<boolean> {
  const { count, error } = await client()
    .from('wallet_events')
    .select('id', { count: 'exact', head: true })
    .eq('appointment_id', appointmentId)
    .eq('event', event);
  if (error) throw new Error(`Wallet event read failed: ${error.message}`);
  return Boolean(count);
}

export async function logWalletEvent(input: {
  appointmentId?: string | null;
  event: string;
  platform?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  const { error } = await client().from('wallet_events').insert({
    appointment_id: input.appointmentId ?? null,
    event: input.event,
    platform: input.platform ?? null,
    metadata: input.metadata ?? null,
  });
  if (error) throw new Error(`Wallet event write failed: ${error.message}`);
}
