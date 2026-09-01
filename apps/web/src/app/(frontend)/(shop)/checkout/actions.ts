'use server';

import config from '@payload-config';
import { getPayload } from 'payload';
import { getStripe, stripeEnabled } from '@/lib/stripe';

export type CheckoutLine = { id: number; qty: number };
export type ShippingInput = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  postcode: string;
  phone: string;
  country?: string;
};

/** Recompute the cart total from the database — never trust the client. */
async function priceCart(
  payload: Awaited<ReturnType<typeof getPayload>>,
  lines: CheckoutLine[],
): Promise<{ items: { product: number; quantity: number; unitPricePence: number }[]; total: number }> {
  const items: { product: number; quantity: number; unitPricePence: number }[] = [];
  let total = 0;
  for (const line of lines) {
    const product = await payload.findByID({ collection: 'products', id: line.id }).catch(() => null);
    if (!product || !product.active) continue;
    const qty = Math.max(1, Math.floor(line.qty));
    items.push({ product: product.id, quantity: qty, unitPricePence: product.pricePence });
    total += product.pricePence * qty;
  }
  return { items, total };
}

export type IntentResult =
  | { ok: true; clientSecret: string; amountPence: number }
  | { ok: false; error: string };

/** Create a Stripe PaymentIntent for the cart. */
export async function createPaymentIntent(lines: CheckoutLine[]): Promise<IntentResult> {
  if (!lines?.length) return { ok: false, error: 'Your cart is empty.' };
  const stripe = getStripe();
  if (!stripe) return { ok: false, error: 'Payments are not configured yet.' };

  const payload = await getPayload({ config });
  const { total } = await priceCart(payload, lines);
  if (total <= 0) return { ok: false, error: 'None of the items are available to order.' };

  const intent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'gbp',
    automatic_payment_methods: { enabled: true },
    metadata: { source: 'moves-storefront' },
  });
  return { ok: true, clientSecret: intent.client_secret as string, amountPence: total };
}

export type FinalizeResult = { ok: true; reference: string } | { ok: false; error: string };

/** After Stripe confirms payment, verify it server-side and create the order. */
export async function finalizeOrder(
  paymentIntentId: string,
  shipping: ShippingInput,
  lines: CheckoutLine[],
): Promise<FinalizeResult> {
  const stripe = getStripe();
  if (!stripe) return { ok: false, error: 'Payments are not configured.' };

  // Confirm the charge actually succeeded before recording anything.
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId).catch(() => null);
  if (!intent || intent.status !== 'succeeded') {
    return { ok: false, error: 'Payment was not completed.' };
  }

  return createOrderRecord(shipping, lines, { paid: true, amountPence: intent.amount, ref: intent.id });
}

/** Fallback when Stripe isn't configured — place the order without payment. */
export async function placeOrderUnpaid(
  shipping: ShippingInput,
  lines: CheckoutLine[],
): Promise<FinalizeResult> {
  if (stripeEnabled()) return { ok: false, error: 'Please pay to complete your order.' };
  return createOrderRecord(shipping, lines, { paid: false });
}

async function createOrderRecord(
  shipping: ShippingInput,
  lines: CheckoutLine[],
  opts: { paid: boolean; amountPence?: number; ref?: string },
): Promise<FinalizeResult> {
  const name = `${shipping.firstName ?? ''} ${shipping.lastName ?? ''}`.trim();
  const email = shipping.email?.trim();
  if (!name || !email) return { ok: false, error: 'Enter your name and email.' };
  if (!lines?.length) return { ok: false, error: 'Your cart is empty.' };

  const payload = await getPayload({ config });
  const { items, total } = await priceCart(payload, lines);
  if (!items.length) return { ok: false, error: 'None of the items are available to order.' };

  try {
    // Find or create the customer.
    const existing = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, overrideAccess: true });
    const address = {
      line1: shipping.address?.trim() || undefined,
      line2: shipping.apartment?.trim() || undefined,
      city: shipping.city?.trim() || undefined,
      postcode: shipping.postcode?.trim() || undefined,
      country: shipping.country?.trim() || 'United Kingdom',
    };
    let customerId: number;
    if (existing.docs[0]) {
      customerId = existing.docs[0].id as number;
      await payload.update({ collection: 'customers', id: customerId, overrideAccess: true, data: { name, phone: shipping.phone?.trim() || undefined, address } });
    } else {
      const created = await payload.create({ collection: 'customers', overrideAccess: true, data: { name, email, phone: shipping.phone?.trim() || undefined, address } });
      customerId = created.id as number;
    }

    const now = new Date().toISOString();
    const timeline = [
      { kind: 'event' as const, text: 'Order placed from the online store', at: now },
      ...(opts.paid ? [{ kind: 'event' as const, text: `Payment received${opts.ref ? ` (${opts.ref})` : ''}`, at: now }] : []),
      { kind: 'email' as const, text: `Order confirmation email sent to ${email}`, at: now },
    ];

    const order = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        customer: customerId,
        patientName: name,
        patientEmail: email,
        patientPhone: shipping.phone?.trim() || undefined,
        lineItems: items,
        amountPence: total,
        status: 'placed',
        fulfillmentStatus: 'unfulfilled',
        notes: opts.paid ? 'Paid online via Stripe.' : 'Placed online (payment not configured).',
        shippingAddress: {
          name,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          postcode: address.postcode,
          country: address.country,
          phone: shipping.phone?.trim() || undefined,
        },
        timeline,
      },
    });
    return { ok: true, reference: order.reference as string };
  } catch (err) {
    console.error('[checkout] createOrderRecord failed', err);
    return { ok: false, error: 'Something went wrong recording your order. Please contact us.' };
  }
}
