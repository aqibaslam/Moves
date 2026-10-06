import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

import { getLiveAppointment, syncWalletContact } from '@/lib/booking/ghl';
import { pushApplePassUpdates } from '@/lib/wallet/apple-push';
import { googleWalletObjectId, googleWalletRequest } from '@/lib/wallet/google';
import {
  activeWalletDevices,
  dueWalletBookings,
  logWalletEvent,
  updateWalletBooking,
  walletEventExists,
  type WalletBookingRow,
  pendingGoogleWalletBookings,
  markGoogleWalletChecked,
  updateWalletStatus,
} from '@/lib/wallet/storage';

const MINUTE = 60_000;
const APPLE_SENT = 'wallet_reminder_apple_sent';
const GOOGLE_SENT = 'wallet_reminder_google_sent';
const GOOGLE_MESSAGE_ID = 'moves_one_hour_reminder';

function secureEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const supplied = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  return secureEqual(supplied, secret);
}

export function reminderWindow(now = Date.now()) {
  return {
    from: new Date(now + 55 * MINUTE).toISOString(),
    to: new Date(now + 61 * MINUTE).toISOString(),
  };
}

export function googleReminderMessage(row: WalletBookingRow, now = Date.now()) {
  const callTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: row.timezone || 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(row.start_at));
  return {
    header: 'Your MOVES consultation starts in one hour',
    body: `${callTime} on Google Meet. Open your pass and tap Join Google Meet when it’s time.`,
    id: GOOGLE_MESSAGE_ID,
    messageType: 'TEXT_AND_NOTIFY',
    displayInterval: {
      start: { date: new Date(now).toISOString() },
      end: { date: new Date(new Date(row.start_at).getTime() + 15 * MINUTE).toISOString() },
    },
  };
}

function cancelled(status: string): boolean {
  return ['cancelled', 'canceled', 'invalid'].includes(status.toLowerCase());
}

async function currentBooking(row: WalletBookingRow): Promise<WalletBookingRow | null> {
  const live = await getLiveAppointment(row.appointment_id);
  if (!live || cancelled(live.status)) {
    await updateWalletBooking(row.appointment_id, { status: live?.status ?? 'missing' });
    return null;
  }
  const next: WalletBookingRow = {
    ...row,
    contact_id: live.contactId ?? row.contact_id,
    start_at: live.startISO,
    end_at: live.endISO ?? row.end_at,
    meeting_url: live.meetingUrl ?? row.meeting_url,
    status: live.status,
  };
  if (
    next.contact_id !== row.contact_id ||
    next.start_at !== row.start_at ||
    next.end_at !== row.end_at ||
    next.meeting_url !== row.meeting_url ||
    next.status !== row.status
  ) {
    await updateWalletBooking(row.appointment_id, {
      contact_id: next.contact_id,
      start_at: next.start_at,
      end_at: next.end_at,
      meeting_url: next.meeting_url,
      status: next.status,
    });
  }
  return next;
}

async function sendApple(row: WalletBookingRow, dryRun: boolean) {
  if (await walletEventExists(row.appointment_id, APPLE_SENT)) return { state: 'already_sent' };
  const devices = (await activeWalletDevices(row.serial)).filter((device) => device.push_token);
  if (!devices.length) return { state: 'not_saved' };
  if (dryRun) return { state: 'would_send', devices: devices.length };
  await updateWalletBooking(row.appointment_id, {});
  const results = await pushApplePassUpdates(devices.map((device) => device.push_token as string));
  const sent = results.filter((result) => result.ok).length;
  await logWalletEvent({
    appointmentId: row.appointment_id,
    event: sent ? APPLE_SENT : 'wallet_reminder_apple_failed',
    platform: 'apple',
    metadata: {
      sent,
      failed: results.length - sent,
      failures: results.filter((result) => !result.ok).map(({ status, reason }) => ({ status, reason })),
    },
  });
  return { state: sent ? 'sent' : 'failed', sent, failed: results.length - sent };
}

async function sendGoogle(row: WalletBookingRow, now: number, dryRun: boolean) {
  if (await walletEventExists(row.appointment_id, GOOGLE_SENT)) return { state: 'already_sent' };
  const objectPath = `/genericObject/${encodeURIComponent(googleWalletObjectId(row.appointment_id))}`;
  const current = await googleWalletRequest(objectPath);
  if (current.response.status === 404) return { state: 'not_saved' };
  if (!current.response.ok) {
    throw new Error(`Google Wallet object read failed: ${current.response.status}`);
  }
  if (current.data.hasUsers !== true) return { state: 'not_saved' };
  const messages = Array.isArray(current.data.messages)
    ? (current.data.messages as Array<{ id?: string }>)
    : [];
  if (messages.some((message) => message.id === GOOGLE_MESSAGE_ID)) {
    await logWalletEvent({
      appointmentId: row.appointment_id,
      event: GOOGLE_SENT,
      platform: 'google',
      metadata: { recovered: true },
    });
    return { state: 'already_sent' };
  }
  if (dryRun) return { state: 'would_send' };
  const sent = await googleWalletRequest(`${objectPath}/addMessage`, {
    method: 'POST',
    body: JSON.stringify({ message: googleReminderMessage(row, now) }),
  });
  if (!sent.response.ok) {
    throw new Error(`Google Wallet reminder failed: ${sent.response.status}`);
  }
  await logWalletEvent({
    appointmentId: row.appointment_id,
    event: GOOGLE_SENT,
    platform: 'google',
    metadata: { objectId: googleWalletObjectId(row.appointment_id) },
  });
  return { state: 'sent' };
}

async function confirmGoogleWalletAdds(dryRun: boolean) {
  const rows = await pendingGoogleWalletBookings();
  const results = [];
  for (const row of rows) {
    try {
      const objectId = googleWalletObjectId(row.appointment_id);
      const current = await googleWalletRequest(`/genericObject/${encodeURIComponent(objectId)}`);
      if (!dryRun) await markGoogleWalletChecked(row);
      if (current.response.status === 404) {
        results.push({ appointmentId: row.appointment_id, state: 'pending' });
        continue;
      }
      if (!current.response.ok) throw new Error(`Google Wallet object read failed: ${current.response.status}`);
      if (current.data.hasUsers !== true) {
        results.push({ appointmentId: row.appointment_id, state: 'pending' });
        continue;
      }
      if (!dryRun) {
        await Promise.all([
          updateWalletStatus(row.appointment_id, 'google', 'added'),
          logWalletEvent({
            appointmentId: row.appointment_id,
            event: 'wallet_added',
            platform: 'google',
            metadata: { objectId, verifiedBy: 'hasUsers' },
          }),
          syncWalletContact(row.contact_id, 'google', 'added').catch((syncError) =>
            console.error('[wallet/google] GHL added sync failed', syncError),
          ),
        ]);
      }
      results.push({ appointmentId: row.appointment_id, state: dryRun ? 'would_confirm' : 'confirmed' });
    } catch (error) {
      results.push({
        appointmentId: row.appointment_id,
        state: 'error',
        error: error instanceof Error ? error.message : 'Unknown Google Wallet confirmation error',
      });
    }
  }
  return results;
}

export async function runWalletReminders(options: { now?: number; dryRun?: boolean } = {}) {
  const now = options.now ?? Date.now();
  const window = reminderWindow(now);
  const rows = await dueWalletBookings(window.from, window.to);
  const googleConfirmations = await confirmGoogleWalletAdds(Boolean(options.dryRun));
  const results = [];
  for (const original of rows) {
    try {
      const row = await currentBooking(original);
      const minutesUntil = row ? (Date.parse(row.start_at) - now) / MINUTE : null;
      if (!row || minutesUntil === null || minutesUntil < 55 || minutesUntil > 61) {
        results.push({
          appointmentId: original.appointment_id,
          state: row ? 'moved_outside_window' : 'cancelled_or_missing',
        });
        continue;
      }
      const [apple, google] = await Promise.all([
        sendApple(row, Boolean(options.dryRun)),
        sendGoogle(row, now, Boolean(options.dryRun)),
      ]);
      results.push({ appointmentId: row.appointment_id, apple, google });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Wallet reminder error';
      await logWalletEvent({
        appointmentId: original.appointment_id,
        event: 'wallet_reminder_error',
        metadata: { message },
      });
      results.push({ appointmentId: original.appointment_id, error: message });
    }
  }
  return {
    window,
    checked: rows.length,
    googleConfirmations,
    dryRun: Boolean(options.dryRun),
    results,
  };
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorised' }, { status: 401 });
  }
  const url = new URL(request.url);
  const dryRun = url.searchParams.get('dryRun') === '1';
  const requestedNow = dryRun ? Date.parse(url.searchParams.get('now') ?? '') : Number.NaN;
  const now = Number.isFinite(requestedNow) ? requestedNow : undefined;
  return NextResponse.json({ ok: true, ...(await runWalletReminders({ dryRun, now })) });
}
