import { randomBytes } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

/** Kick off Google OAuth: redirect to Google's consent screen. */
export function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const origin = request.nextUrl.origin;
  if (!clientId) {
    return NextResponse.redirect(`${origin}/signup?google=unconfigured`);
  }

  const state = randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  // state is validated on callback (CSRF guard)
  res.cookies.set('moves_g_state', state, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 600, secure: process.env.NODE_ENV === 'production' });
  return res;
}
