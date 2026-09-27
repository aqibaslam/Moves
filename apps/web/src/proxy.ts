/**
 * Next.js 16 renamed the `middleware` file convention to `proxy` — same
 * capability, clearer name. The exported function must be called `proxy`.
 *
 * Jobs:
 *   1. the pre-launch password wall on public pages
 *   2. a cheap signed-out redirect for /admin (the Moves staff dashboard)
 *
 * The dashboard check here only looks for the presence of Payload's auth
 * cookie. It is a fast path to avoid rendering a page we know will bounce —
 * NOT a security boundary. The real verification is payload.auth() in
 * app/(dashboard)/dashboard/layout.tsx, which validates the token against the
 * database. Never rely on this cookie check alone.
 */
import { NextResponse, type NextRequest } from 'next/server';

/** Shared with app/(frontend)/password/gate.ts. */
const GATE_COOKIE = 'moves_gate';
const GATE_TOKEN = 'unlocked';

/** Payload's default auth cookie (no cookiePrefix is configured). */
const AUTH_COOKIE = 'payload-token';
/** Storefront customer session — see lib/customer-session.ts (same name). */
const CUSTOMER_COOKIE = 'moves_customer';

function isGateExempt(pathname: string): boolean {
  return (
    pathname === '/password' ||
    pathname.startsWith('/password/') ||
    pathname === '/signup' ||
    pathname.startsWith('/signup/') ||
    pathname === '/lock' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/cms') ||
    pathname === '/login' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * The public home entry sends visitors straight to /signup before the
   * password gate runs. This keeps both the bare domain and campaign query
   * strings public while every other storefront route remains protected.
   *
   * The single pass-through is the post-signup landing: the magic link and
   * Google callback both set `moves_customer` and redirect to `/?welcome=1`.
   * Bouncing that request back to /signup would look like the login failed,
   * so it is allowed through only when the flag AND the cookie are present.
   * The bare URL (movesuk.com/) always goes to the public signup page.
   */
  if (pathname === '/') {
    const justSignedUp = request.nextUrl.searchParams.get('welcome') === '1' && Boolean(request.cookies.get(CUSTOMER_COOKIE));
    if (!justSignedUp) {
      const to = request.nextUrl.clone();
      to.pathname = '/signup'; // query string (e.g. utm_*) is kept
      return NextResponse.redirect(to);
    }
  }

  if (!isGateExempt(pathname)) {
    const unlocked = request.cookies.get(GATE_COOKIE)?.value === GATE_TOKEN;
    if (!unlocked) {
      const to = request.nextUrl.clone();
      to.pathname = '/password';
      to.search = '';
      to.searchParams.set('from', pathname + request.nextUrl.search);
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
