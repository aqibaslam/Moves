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
export type PlaceOrderResult = { ok: true; reference: string } | { ok: false; error: string };

/**
 * Places a storefront order. Creates ONE order with line items and a linked
 * customer, so site orders look identical to ones made in the dashboard — they
 * appear in Orders AND in the Customers tab.
 *
 * overrideAccess: true because the shopper is anonymous — a trusted server
 * write on their behalf. Prices come from the DB, never the client.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const name = input.name?.trim();
  const email = input.email?.trim();
  if (!name || !email) return { ok: false, error: 'Enter your name and email.' };
  if (!input.lines?.length) return { ok: false, error: 'Your cart is empty.' };

  const payload = await getPayload({ config });

  try {
    // Find or create the customer by email.
    const existing = await payload.find({
      collection: 'customers',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    });
    let customerId: number;
    if (existing.docs[0]) {
      customerId = existing.docs[0].id as number;
      await payload.update({
        collection: 'customers',
        id: customerId,
        overrideAccess: true,
        data: { name, phone: input.phone?.trim() || undefined },
      });
    } else {
      const created = await payload.create({
        collection: 'customers',
        overrideAccess: true,
        data: { name, email, phone: input.phone?.trim() || undefined },
      });
      customerId = created.id as number;
    }

    // Build line items, pricing each from the DB.
    const lineItems: { product: number; quantity: number; unitPricePence: number }[] = [];
    let total = 0;
    for (const line of input.lines) {
      const product = await payload.findByID({ collection: 'products', id: line.id }).catch(() => null);
      if (!product || !product.active) continue;
      const qty = Math.max(1, Math.floor(line.qty));
      lineItems.push({ product: product.id, quantity: qty, unitPricePence: product.pricePence });
      total += product.pricePence * qty;
    }
    if (!lineItems.length) return { ok: false, error: 'None of the items are available to order.' };

    const now = new Date().toISOString();
    const order = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        customer: customerId,
        patientName: name,
        patientEmail: email,
        patientPhone: input.phone?.trim() || undefined,
        lineItems,
        amountPence: total,
        status: 'placed',
        fulfillmentStatus: 'unfulfilled',
        notes: 'Order placed from the online store.',
        timeline: [
          { kind: 'event', text: 'Order placed from the online store', at: now },
          { kind: 'email', text: `Order confirmation email sent to ${email}`, at: now },
        ],
      },
    });

    return { ok: true, reference: order.reference as string };
  } catch (err) {
    console.error('[checkout] placeOrder failed', err);
    return { ok: false, error: 'Something went wrong placing your order. Please try again.' };
  }
}
