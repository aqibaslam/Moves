import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

import { getLiveAppointment } from '@/lib/booking/ghl';
import { syncWalletContact } from '@/lib/booking/ghl';
import { applePassAuthenticationToken, buildApplePass } from '@/lib/wallet/apple';
import {
  changedSerials,
  deviceSerials,
  getWalletBookingBySerial,
  logWalletEvent,
  removeWalletDevice,
  updateWalletBooking,
  updateWalletStatus,
  upsertWalletDevice,
} from '@/lib/wallet/storage';

interface Context {
  params: Promise<{ path: string[] }>;
}

function equalSecret(given: string, expected: string): boolean {
  const left = Buffer.from(given);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function authorised(request: Request, serial: string): boolean {
  const given = (request.headers.get('authorization') ?? '').replace(/^ApplePass\s+/i, '');
  return equalSecret(given, applePassAuthenticationToken(serial));
}

function routeParts(path: string[]) {
  return path.map(decodeURIComponent);
}

async function latestPass(request: Request, serial: string) {
  const row = await getWalletBookingBySerial(serial);
  if (!row) return null;
  const live = await getLiveAppointment(row.appointment_id);
  const startISO = live?.startISO ?? row.start_at;
  const endISO = live?.endISO ?? row.end_at;
  const meetingUrl = live?.meetingUrl ?? row.meeting_url;
  const status = live?.status ?? row.status;
  if (
    startISO !== row.start_at ||
    endISO !== row.end_at ||
    meetingUrl !== row.meeting_url ||
    status !== row.status
  ) {
    await updateWalletBooking(row.appointment_id, {
      start_at: startISO,
      end_at: endISO,
      meeting_url: meetingUrl,
      status,
    });
  }
  const pass = await buildApplePass(
    {
      appointmentId: row.appointment_id,
      firstName: row.first_name,
      lastName: row.last_name,
      startISO,
      meetingUrl,
    },
    { origin: new URL(request.url).origin, status },
  );
  return { pass, updatedAt: new Date(row.updated_at) };
}

export async function POST(request: Request, context: Context) {
  const parts = routeParts((await context.params).path);
  if (parts.length === 6 && parts[0] === 'v1' && parts[1] === 'devices' && parts[3] === 'registrations') {
    const [, , deviceId, , passType, serial] = parts;
    if (passType !== process.env.APPLE_PASS_TYPE_ID) return new NextResponse(null, { status: 404 });
    if (!authorised(request, serial)) return new NextResponse(null, { status: 401 });
    const body = (await request.json().catch(() => ({}))) as { pushToken?: string };
    const wasActive = await upsertWalletDevice({
      serial,
      deviceId,
      passType,
      pushToken: body.pushToken ?? null,
    });
    if (!wasActive) {
      const row = await getWalletBookingBySerial(serial);
      if (row) {
        await Promise.all([
          updateWalletStatus(row.appointment_id, 'apple', 'added'),
          logWalletEvent({
            appointmentId: row.appointment_id,
            event: 'wallet_added',
            platform: 'apple',
            metadata: { deviceId },
          }),
          syncWalletContact(row.contact_id, 'apple', 'added').catch((syncError) =>
            console.error('[wallet/apple] GHL added sync failed', syncError),
          ),
        ]);
      }
    }
    return new NextResponse(null, { status: wasActive ? 200 : 201 });
  }
  if (parts.length === 2 && parts[0] === 'v1' && parts[1] === 'log') {
    const body = (await request.json().catch(() => ({}))) as { logs?: unknown[] };
    await logWalletEvent({
      event: 'apple_wallet_log',
      platform: 'apple',
      metadata: { logs: (body.logs ?? []).slice(0, 20).map((entry) => String(entry).slice(0, 500)) },
    });
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 404 });
}

export async function DELETE(request: Request, context: Context) {
  const parts = routeParts((await context.params).path);
  if (!(parts.length === 6 && parts[0] === 'v1' && parts[1] === 'devices' && parts[3] === 'registrations')) {
    return new NextResponse(null, { status: 404 });
  }
  const [, , deviceId, , passType, serial] = parts;
  if (passType !== process.env.APPLE_PASS_TYPE_ID) return new NextResponse(null, { status: 404 });
  if (!authorised(request, serial)) return new NextResponse(null, { status: 401 });
  await removeWalletDevice(serial, deviceId, passType);
  const row = await getWalletBookingBySerial(serial);
  if (row) {
    await Promise.all([
      updateWalletStatus(row.appointment_id, 'apple', 'removed'),
      logWalletEvent({
        appointmentId: row.appointment_id,
        event: 'wallet_removed',
        platform: 'apple',
        metadata: { deviceId },
      }),
      syncWalletContact(row.contact_id, 'apple', 'removed').catch((syncError) =>
        console.error('[wallet/apple] GHL removed sync failed', syncError),
      ),
    ]);
  }
  return new NextResponse(null, { status: 200 });
}

export async function GET(request: Request, context: Context) {
  const parts = routeParts((await context.params).path);
  if (parts.length === 5 && parts[0] === 'v1' && parts[1] === 'devices' && parts[3] === 'registrations') {
    const [, , deviceId, , passType] = parts;
    if (passType !== process.env.APPLE_PASS_TYPE_ID) return new NextResponse(null, { status: 404 });
    const serials = await deviceSerials(deviceId, passType);
    if (!serials.length) return new NextResponse(null, { status: 404 });
    const sinceRaw = new URL(request.url).searchParams.get('passesUpdatedSince');
    const sinceNumber = Number(sinceRaw);
    const since = Number.isFinite(sinceNumber) ? new Date(sinceNumber) : new Date(0);
    const updated = await changedSerials(serials, since);
    if (!updated.length) return new NextResponse(null, { status: 204 });
    return NextResponse.json({ serialNumbers: updated, lastUpdated: String(Date.now()) });
  }
  if (parts.length === 4 && parts[0] === 'v1' && parts[1] === 'passes') {
    const [, , passType, serial] = parts;
    if (passType !== process.env.APPLE_PASS_TYPE_ID) return new NextResponse(null, { status: 404 });
    if (!authorised(request, serial)) return new NextResponse(null, { status: 401 });
    const latest = await latestPass(request, serial);
    if (!latest) return new NextResponse(null, { status: 404 });
    const modifiedSince = Date.parse(request.headers.get('if-modified-since') ?? '');
    if (Number.isFinite(modifiedSince) && latest.updatedAt.getTime() <= modifiedSince + 999) {
      return new NextResponse(null, { status: 304 });
    }
    return new NextResponse(new Uint8Array(latest.pass), {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Last-Modified': latest.updatedAt.toUTCString(),
        'Cache-Control': 'private, no-store',
      },
    });
  }
  return new NextResponse(null, { status: 404 });
}
