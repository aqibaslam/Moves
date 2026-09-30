import { NextResponse } from 'next/server';

import { googleWalletConfigured } from '@/lib/wallet/config';
import { createGoogleSaveUrl } from '@/lib/wallet/google';
import { readWalletToken } from '@/lib/wallet/token';

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!googleWalletConfigured()) {
    return NextResponse.json({ ok: false, error: 'Google Wallet is not available yet.' }, { status: 503 });
  }
  try {
    const { token } = await params;
    const payload = await readWalletToken(token);
    return NextResponse.redirect(await createGoogleSaveUrl(payload));
  } catch (error) {
    console.error('[wallet/google] pass generation failed', error);
    return NextResponse.json({ ok: false, error: 'This Wallet link is invalid or has expired.' }, { status: 400 });
  }
}
