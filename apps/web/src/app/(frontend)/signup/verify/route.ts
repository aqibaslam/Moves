import config from '@payload-config';
import { NextResponse, type NextRequest } from 'next/server';
import { getPayload } from 'payload';
import { sessionCookieOptions, sessionValue, CUSTOMER_COOKIE } from '@/lib/customer-session';

/**
 * Consumes the one-time sign-up link: verifies the customer, logs them in
 * (sets the session cookie), and sends them to the home page — signed in.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const token = request.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.redirect(`${origin}/signup?e=expired`);

  const payload = await getPayload({ config });
  const res = await payload.find({ collection: 'customers', where: { signupToken: { equals: token } }, limit: 1, overrideAccess: true });
  const customer = res.docs[0];
  const exp = customer?.signupTokenExpiry ? new Date(customer.signupTokenExpiry).getTime() : 0;

  if (!customer || !exp || exp < Date.now()) {
    return NextResponse.redirect(`${origin}/signup?e=expired`);
  }

  await payload.update({
    collection: 'customers',
    id: customer.id,
    overrideAccess: true,
    data: { verified: true, signupToken: null, signupTokenExpiry: null },
  });

  // Log them in and land on the home page.
  const redirect = NextResponse.redirect(`${origin}/?welcome=1`);
  redirect.cookies.set(CUSTOMER_COOKIE, sessionValue(customer.id as number), sessionCookieOptions());
  return redirect;
}
