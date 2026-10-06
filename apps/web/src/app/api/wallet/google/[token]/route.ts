import { NextResponse } from 'next/server';

import { googleWalletConfigured } from '@/lib/wallet/config';
import { syncWalletContact } from '@/lib/booking/ghl';
import { createGoogleSaveUrl } from '@/lib/wallet/google';
import { getWalletBookingBySerial, logWalletEvent, updateWalletStatus } from '@/lib/wallet/storage';
import { readWalletToken, walletSerialNumber } from '@/lib/wallet/token';

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!googleWalletConfigured()) {
    return NextResponse.json({ ok: false, error: 'Google Wallet is not available yet.' }, { status: 503 });
  }
  try {
    const { token } = await params;
    const payload = await readWalletToken(token);
    const booking = await getWalletBookingBySerial(walletSerialNumber(payload.appointmentId));
    await Promise.allSettled([
      updateWalletStatus(payload.appointmentId, 'google', 'clicked'),
      logWalletEvent({ appointmentId: payload.appointmentId, event: 'wallet_clicked', platform: 'google' }),
      syncWalletContact(booking?.contact_id ?? null, 'google', 'clicked'),
    ]);
    const saveUrl = await createGoogleSaveUrl(payload, new URL(request.url).origin);
    await logWalletEvent({ appointmentId: payload.appointmentId, event: 'wallet_issued', platform: 'google' })
      .catch((trackingError) => console.error('[wallet/google] issued tracking failed', trackingError));
    return NextResponse.redirect(saveUrl);
  } catch (error) {
    console.error('[wallet/google] pass generation failed', error);
    return NextResponse.json({ ok: false, error: 'This Wallet link is invalid or has expired.' }, { status: 400 });
  }
}
