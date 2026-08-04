import { NextResponse } from 'next/server';
import { GATE_COOKIE } from '../password/gate';

/** Clears the launch-gate cookie and bounces back to the wall — handy for
 *  re-locking the site while testing (or to "log out" of the gate). */
export function GET(request: Request) {
  const res = NextResponse.redirect(new URL('/password', request.url));
  res.cookies.set(GATE_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
