import type { Metadata } from 'next';
import config from '@payload-config';
import Link from 'next/link';
import { getPayload } from 'payload';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Confirming your email', robots: { index: false } };

async function consume(token: string): Promise<'ok' | 'invalid'> {
  const payload = await getPayload({ config });
  const res = await payload.find({ collection: 'customers', where: { signupToken: { equals: token } }, limit: 1, overrideAccess: true });
  const customer = res.docs[0];
  if (!customer) return 'invalid';
  const exp = customer.signupTokenExpiry ? new Date(customer.signupTokenExpiry).getTime() : 0;
  if (!exp || exp < Date.now()) return 'invalid';
  await payload.update({
    collection: 'customers',
    id: customer.id,
    overrideAccess: true,
    data: { verified: true, signupToken: null, signupTokenExpiry: null },
  });
  return 'ok';
}

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string; google?: string }> }) {
  const { token, google } = await searchParams;
  const state = google === '1' ? 'ok' : token ? await consume(token) : 'invalid';

  return (
    <div className="su__result">
      {state === 'ok' ? (
        <>
          <div className="su__resicon" aria-hidden="true">✓</div>
          <h1 className="su__restitle">You&apos;re all set</h1>
          <p className="su__ressub">Your email is confirmed and your account is ready.</p>
          <Link href="/shop" className="su__resbtn">Start shopping</Link>
        </>
      ) : (
        <>
          <div className="su__resicon su__resicon--bad" aria-hidden="true">!</div>
          <h1 className="su__restitle">This link has expired</h1>
          <p className="su__ressub">One-time links last 30 minutes. Please request a new one.</p>
          <Link href="/signup" className="su__resbtn">Back to sign up</Link>
        </>
      )}
    </div>
  );
}
