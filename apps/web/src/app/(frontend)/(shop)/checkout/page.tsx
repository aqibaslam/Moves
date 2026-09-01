import type { Metadata } from 'next';
import { stripeEnabled } from '@/lib/stripe';
import { CheckoutClient } from './CheckoutClient';

export const metadata: Metadata = { title: 'Checkout' };
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return (
    <div className="co">
      <CheckoutClient
        stripeEnabled={stripeEnabled()}
        publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}
      />
    </div>
  );
}
