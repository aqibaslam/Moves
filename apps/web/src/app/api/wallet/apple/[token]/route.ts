import { NextResponse } from 'next/server';

import { buildApplePass } from '@/lib/wallet/apple';
import { syncWalletContact } from '@/lib/booking/ghl';
import { appleWalletConfigured } from '@/lib/wallet/config';
import { getWalletBookingBySerial, logWalletEvent, updateWalletStatus } from '@/lib/wallet/storage';
import { readWalletToken, walletSerialNumber } from '@/lib/wallet/token';

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!appleWalletConfigured()) {
    return NextResponse.json({ ok: false, error: 'Apple Wallet is not available yet.' }, { status: 503 });
  }
  try {
    const { token } = await params;
    const payload = await readWalletToken(token);
    const booking = await getWalletBookingBySerial(walletSerialNumber(payload.appointmentId));
    await Promise.allSettled([
      updateWalletStatus(payload.appointmentId, 'apple', 'clicked'),
      logWalletEvent({ appointmentId: payload.appointmentId, event: 'wallet_clicked', platform: 'apple' }),
      syncWalletContact(booking?.contact_id ?? null, 'apple', 'clicked'),
    ]);
    const pass = await buildApplePass(payload, { origin: new URL(request.url).origin });
    await logWalletEvent({ appointmentId: payload.appointmentId, event: 'wallet_issued', platform: 'apple' })
      .catch((trackingError) => console.error('[wallet/apple] issued tracking failed', trackingError));
    return new NextResponse(new Uint8Array(pass), {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': 'attachment; filename="moves-consultation.pkpass"',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('[wallet/apple] pass generation failed', error);
    return NextResponse.json({ ok: false, error: 'This Wallet link is invalid or has expired.' }, { status: 400 });
  }
}
