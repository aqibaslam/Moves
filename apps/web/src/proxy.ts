/**
 * Refreshes the Supabase auth session on every request.
 *
 * Next.js 16 renamed the `middleware` file convention to `proxy` — same
 * capability, clearer name. The exported function must be called `proxy`.
 *
 * Server Components cannot write cookies, so without this the access token
 * expires and users get silently logged out. This file is what makes the
 * try/catch in @moves/supabase-client/server safe to swallow.
 *
 * Do not add logic between createServerClient and getUser() — an early return
 * there causes random logouts that are extremely hard to debug.
 */
import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Launch gate — everyone hits a password wall (/password) until they enter the
 * shared password, which sets the `moves_gate` cookie. Kept in sync with
 * app/(frontend)/password/actions.ts.
 */
const GATE_COOKIE = 'moves_gate';
const GATE_TOKEN = 'unlocked';

function isGateExempt(pathname: string): boolean {
  return (
    pathname === '/password' ||
    pathname.startsWith('/password/') ||
    pathname === '/lock' || // clears the gate cookie, then redirects to /password
    pathname.startsWith('/api') || // Payload API (+ server-action posts)
    pathname.startsWith('/admin') || // Payload admin has its own auth
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  );
}

export async function proxy(request: NextRequest) {
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

  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Lets the scaffold run before Supabase is configured. Once you have a
  // project, remove this guard — after that, missing env vars should be a
  // loud failure rather than a silent pass-through.
  if (!url || !anonKey) {
    return supabaseResponse;
  }

  const cookies: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
      supabaseResponse = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) =>
        supabaseResponse.cookies.set(name, value, options),
      );
    },
  };

  const supabase = createServerClient(url, anonKey, { cookies });

  // Revalidates the token. Must be called — do not remove.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate private routes here.
  const isProtected = request.nextUrl.pathname.startsWith('/app');

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
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
