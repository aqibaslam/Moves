import { NextResponse } from 'next/server';

import { buildApplePass } from '@/lib/wallet/apple';
import { appleWalletConfigured } from '@/lib/wallet/config';
import { readWalletToken } from '@/lib/wallet/token';

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!appleWalletConfigured()) {
    return NextResponse.json({ ok: false, error: 'Apple Wallet is not available yet.' }, { status: 503 });
  }
  try {
    const { token } = await params;
    const payload = await readWalletToken(token);
    const pass = await buildApplePass(payload);
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
