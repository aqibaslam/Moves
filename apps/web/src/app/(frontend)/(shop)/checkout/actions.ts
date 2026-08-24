'use server';

import config from '@payload-config';
import { getPayload } from 'payload';

export type CheckoutLine = { id: number; qty: number };
export type PlaceOrderInput = {
  name: string;
  email: string;
  phone?: string;
  lines: CheckoutLine[];
};
export type PlaceOrderResult =
  | { ok: true; references: string[] }
  | { ok: false; error: string };

/**
 * Places an order from the cart. One `orders` row per line (the Orders schema
 * is one-product-per-order); each row's amount is priced from the DB, never
 * from the client, so a tampered cart can't change what's charged.
 *
 * overrideAccess: true because the shopper is anonymous — this is a trusted
 * server write on their behalf, the same pattern as the booking → consultation
 * mirror.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const name = input.name?.trim();
  const email = input.email?.trim();
  if (!name || !email) return { ok: false, error: 'Enter your name and email.' };
  if (!input.lines?.length) return { ok: false, error: 'Your cart is empty.' };

  const payload = await getPayload({ config });
  const references: string[] = [];

  try {
    for (const line of input.lines) {
      const qty = Math.max(1, Math.floor(line.qty));
      // Price authoritatively from the database.
      const product = await payload.findByID({ collection: 'products', id: line.id }).catch(() => null);
      if (!product || !product.active) continue;

      const order = await payload.create({
        collection: 'orders',
        overrideAccess: true,
        data: {
          patientName: name,
          patientEmail: email,
          patientPhone: input.phone?.trim() || undefined,
          product: product.id,
          amountPence: product.pricePence * qty,
          status: 'placed',
          notes: `Online order · ${product.name} × ${qty}`,
        },
      });
      references.push(order.reference as string);
    }
  } catch (err) {
    console.error('[checkout] placeOrder failed', err);
    return { ok: false, error: 'Something went wrong placing your order. Please try again.' };
  }

  if (!references.length) return { ok: false, error: 'None of the items are available to order.' };
  return { ok: true, references };
}
