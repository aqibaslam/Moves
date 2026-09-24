import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const CUSTOMER_COOKIE = 'moves_customer';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  return process.env.PAYLOAD_SECRET || 'dev-secret';
}

function sign(id: number): string {
  return createHmac('sha256', secret()).update(String(id)).digest('hex');
}

/** Cookie value: "<id>.<hmac>" — tamper-proof without a DB lookup. */
export function sessionValue(customerId: number): string {
  return `${customerId}.${sign(customerId)}`;
}

/** Standard cookie options for the customer session. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  };
}

/** The signed-in customer's id, or null. Verifies the HMAC. */
export async function getCustomerSession(): Promise<number | null> {
  const raw = (await cookies()).get(CUSTOMER_COOKIE)?.value;
  if (!raw) return null;
  const [idStr, mac] = raw.split('.');
  const id = Number(idStr);
  if (!idStr || !mac || !Number.isFinite(id)) return null;
  const expected = sign(id);
  try {
    if (mac.length === expected.length && timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return id;
  } catch {
    /* length mismatch */
  }
  return null;
}
