import config from '@payload-config';
import { NextResponse, type NextRequest } from 'next/server';
import { getPayload } from 'payload';
import { sessionCookieOptions, sessionValue, CUSTOMER_COOKIE } from '@/lib/customer-session';

/** Google redirects here with ?code. Exchange it, upsert the customer, done. */
export async function GET(request: NextRequest) {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin).replace(/\/$/, '');
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return NextResponse.redirect(`${origin}/signup?google=unconfigured`);

  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const cookieState = request.cookies.get('moves_g_state')?.value;
  if (!code || !state || state !== cookieState) {
    return NextResponse.redirect(`${origin}/signup?google=failed`);
  }

  try {
    // 1. Exchange the code for tokens.
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) throw new Error(`token ${tokenRes.status}`);
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    // 2. Fetch the profile.
    const infoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!infoRes.ok) throw new Error(`userinfo ${infoRes.status}`);
    const profile = (await infoRes.json()) as { email?: string; name?: string };
    const email = profile.email?.trim().toLowerCase();
    if (!email) throw new Error('no email from Google');

    // 3. Upsert the customer (Google verifies the email, so mark verified).
    const payload = await getPayload({ config });
    const existing = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, overrideAccess: true });
    if (existing.docs[0]) {
      await payload.update({ collection: 'customers', id: existing.docs[0].id, overrideAccess: true, data: { verified: true, signupSource: 'google', name: profile.name || existing.docs[0].name } });
    } else {
      await payload.create({ collection: 'customers', overrideAccess: true, data: { name: profile.name || email.split('@')[0], email, verified: true, signupSource: 'google' } });
    }

    const cid = (existing.docs[0]?.id ?? (await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, overrideAccess: true })).docs[0]?.id) as number;
    const res = NextResponse.redirect(`${origin}/?welcome=1`);
    res.cookies.delete('moves_g_state');
    if (cid) res.cookies.set(CUSTOMER_COOKIE, sessionValue(cid), sessionCookieOptions());
    return res;
  } catch (err) {
    console.error('[google-oauth] callback failed', err);
    return NextResponse.redirect(`${origin}/signup?google=failed`);
  }
}
