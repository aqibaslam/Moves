import type { Metadata } from 'next';
import { CheckoutClient } from './CheckoutClient';

export const metadata: Metadata = { title: 'Checkout' };

export default function CheckoutPage() {
  return (
    <div className="co">
      <h1 className="co__title">Checkout</h1>
      <CheckoutClient />
    </div>
  );
}
