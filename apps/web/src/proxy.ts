/**
 * Next.js 16 renamed the `middleware` file convention to `proxy` — same
 * capability, clearer name. The exported function must be called `proxy`.
 *
 * Job: a cheap signed-out redirect for /admin (the Moves staff dashboard).
 *
 * The dashboard check here only looks for the presence of Payload's auth
 * cookie. It is a fast path to avoid rendering a page we know will bounce —
 * NOT a security boundary. The real verification is payload.auth() in
 * app/(dashboard)/dashboard/layout.tsx, which validates the token against the
 * database. Never rely on this cookie check alone.
 *
 * (The pre-launch password wall has been removed — the site is public.)
 */
import { NextResponse, type NextRequest } from 'next/server';

/** Payload's default auth cookie (no cookiePrefix is configured). */
const AUTH_COOKIE = 'payload-token';
/** Storefront customer session — see lib/customer-session.ts (same name). */
const CUSTOMER_COOKIE = 'moves_customer';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Home gate: movesuk.com/ ALWAYS sends visitors to /signup — including
   * customers who signed up earlier and still carry the session cookie.
   *
   * The single pass-through is the post-signup landing: the magic link and
   * Google callback both set `moves_customer` and redirect to `/?welcome=1`.
   * Bouncing that request back to /signup would look like the login failed,
   * so it is allowed through only when the flag AND the cookie are present.
   * The bare URL (movesuk.com/) never bypasses the gate.
   */
  if (pathname === '/') {
    const justSignedUp = request.nextUrl.searchParams.get('welcome') === '1' && Boolean(request.cookies.get(CUSTOMER_COOKIE));
    if (!justSignedUp) {
      const to = request.nextUrl.clone();
      to.pathname = '/signup'; // query string (e.g. utm_*) is kept
      return NextResponse.redirect(to);
    }
  }

  if (pathname.startsWith('/admin') && !request.cookies.get(AUTH_COOKIE)) {
    const to = request.nextUrl.clone();
    to.pathname = '/login';
    to.search = '';
    to.searchParams.set('next', pathname);
    return NextResponse.redirect(to);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and images — those never need a session
     * and running this on them wastes latency on every page load.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff2?)$).*)',
  ],
};
