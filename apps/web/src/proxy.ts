/**
 * Next.js 16 renamed the `middleware` file convention to `proxy` — same
 * capability, clearer name. The exported function must be called `proxy`.
 *
 * Two jobs:
 *   1. the pre-launch password wall on the public site
 *   2. a cheap signed-out redirect for /dashboard
 *
 * The dashboard check here only looks for the presence of Payload's auth
 * cookie. It is a fast path to avoid rendering a page we know will bounce —
 * NOT a security boundary. The real verification is payload.auth() in
 * app/(dashboard)/dashboard/layout.tsx, which validates the token against the
 * database. Never rely on this cookie check alone.
 */
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Launch gate — everyone hits a password wall (/password) until they enter the
 * shared password, which sets the `moves_gate` cookie. Kept in sync with
 * app/(frontend)/password/actions.ts.
 */
const GATE_COOKIE = 'moves_gate';
const GATE_TOKEN = 'unlocked';

/** Payload's default auth cookie (no cookiePrefix is configured). */
const AUTH_COOKIE = 'payload-token';

function isGateExempt(pathname: string): boolean {
  return (
    pathname === '/password' ||
    pathname.startsWith('/password/') ||
    pathname === '/lock' || // clears the gate cookie, then redirects to /password
    pathname.startsWith('/api') || // Payload API (+ server-action posts)
    pathname.startsWith('/admin') || // Payload admin has its own auth
    pathname === '/login' || // Moves dashboard sign-in
    pathname.startsWith('/dashboard') || // Moves dashboard has its own auth
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Password wall: block everything but the exemptions until unlocked.
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

  if (pathname.startsWith('/dashboard') && !request.cookies.get(AUTH_COOKIE)) {
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
