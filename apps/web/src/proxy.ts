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

/** Payload's default auth cookie (no cookiePrefix is configured). */
const AUTH_COOKIE = 'payload-token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Launch gate removed — the site is public. The dashboard keeps its own auth.
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
