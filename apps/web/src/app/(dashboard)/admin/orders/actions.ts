'use server';

import config from '@payload-config';
import { revalidatePath } from 'next/cache';
import { getPayload } from 'payload';
import { getPayloadUser } from '../../lib/auth';

export type OrderLineInput = { productId: number; quantity: number };
export type OrderCustomerInput = {
  name: string;
  email: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postcode?: string;
  country?: string;
};
export type OrderInput = {
  id?: number; // present when editing
  customer: OrderCustomerInput;
  lines: OrderLineInput[];
  status: 'draft' | 'placed';
  shippingPence?: number;
  tags?: string;
  notes?: string;
};
export type OrderResult = { ok: true; id: number; reference: string } | { ok: false; error: string };

/** Find a customer by email or create one; keep their details current. */
async function upsertCustomer(
  payload: Awaited<ReturnType<typeof getPayload>>,
  user: NonNullable<Awaited<ReturnType<typeof getPayloadUser>>>,
  c: OrderCustomerInput,
): Promise<number> {
  const address = {
    line1: c.line1?.trim() || undefined,
    line2: c.line2?.trim() || undefined,
    city: c.city?.trim() || undefined,
    postcode: c.postcode?.trim() || undefined,
    country: c.country?.trim() || 'United Kingdom',
  };
  const existing = await payload.find({
    collection: 'customers',
    where: { email: { equals: c.email.trim() } },
    limit: 1,
    user,
    overrideAccess: false,
  });
  if (existing.docs[0]) {
    const doc = existing.docs[0];
    await payload.update({
      collection: 'customers',
      id: doc.id,
      user,
      overrideAccess: false,
      data: { name: c.name.trim(), phone: c.phone?.trim() || undefined, address },
    });
    return doc.id as number;
  }
  const created = await payload.create({
    collection: 'customers',
    user,
    overrideAccess: false,
    data: { name: c.name.trim(), email: c.email.trim(), phone: c.phone?.trim() || undefined, address },
  });
  return created.id as number;
}

export async function saveOrder(input: OrderInput): Promise<OrderResult> {
  const user = await getPayloadUser();
  if (!user) return { ok: false, error: 'You need to be signed in.' };
  if (!input.customer?.name?.trim() || !input.customer?.email?.trim()) {
    return { ok: false, error: 'Enter the customer’s name and email.' };
  }
  if (!input.lines?.length) return { ok: false, error: 'Add at least one product.' };

  const payload = await getPayload({ config });
  const tags = (input.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean);

  try {
    const customerId = await upsertCustomer(payload, user, input.customer);

    // Build line items, pricing each from the DB (never the client).
    const lineItems: { product: number; quantity: number; unitPricePence: number }[] = [];
    let total = 0;
    for (const line of input.lines) {
      const product = await payload.findByID({ collection: 'products', id: line.productId }).catch(() => null);
      if (!product) continue;
      const qty = Math.max(1, Math.floor(line.quantity));
      lineItems.push({ product: product.id, quantity: qty, unitPricePence: product.pricePence });
      total += product.pricePence * qty;
    }
    if (!lineItems.length) return { ok: false, error: 'None of the chosen products exist.' };

    const address = input.customer;
    const shippingPence = Math.max(0, Math.floor(input.shippingPence ?? 0));
    const data = {
      customer: customerId,
      patientName: input.customer.name.trim(),
      patientEmail: input.customer.email.trim(),
      patientPhone: input.customer.phone?.trim() || undefined,
      lineItems,
      shippingPence,
      amountPence: total + shippingPence,
      status: input.status,
      tags: tags.length ? tags : undefined,
      notes: input.notes?.trim() || undefined,
      shippingAddress: {
        name: input.customer.name.trim(),
        line1: address.line1?.trim() || undefined,
        line2: address.line2?.trim() || undefined,
        city: address.city?.trim() || undefined,
        postcode: address.postcode?.trim() || undefined,
        country: address.country?.trim() || undefined,
        phone: address.phone?.trim() || undefined,
      },
    };

    let saved;
    if (input.id) {
      saved = await payload.update({ collection: 'orders', id: input.id, user, overrideAccess: false, data });
    } else {
      const stamp = new Date().toISOString();
      const seed: TimelineEntry[] = [{ kind: 'event', text: `Order created by ${authorName(user)}`, author: authorName(user), at: stamp }];
      if (input.status !== 'draft') {
        seed.push({ kind: 'email', text: `Order confirmation email sent to ${input.customer.email.trim()}`, author: authorName(user), at: stamp });
      }
      saved = await payload.create({ collection: 'orders', user, overrideAccess: false, data: { ...data, timeline: seed } });
    }

    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { ok: true, id: saved.id as number, reference: saved.reference as string };
  } catch (err) {
    console.error('[orders] saveOrder failed', err);
    return { ok: false, error: 'Could not save the order. Please try again.' };
  }
}


export async function setFulfillment(orderId: number, status: 'unfulfilled' | 'fulfilled'): Promise<{ ok: boolean }> {
  const user = await getPayloadUser();
  if (!user) return { ok: false };
  const payload = await getPayload({ config });
  try {
    await payload.update({ collection: 'orders', id: orderId, user, overrideAccess: false, data: { fulfillmentStatus: status } });
    await appendTimeline(payload, user, orderId, { kind: 'event', text: status === 'fulfilled' ? 'Marked as fulfilled' : 'Marked as unfulfilled' });
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/orders');
    return { ok: true };
  } catch (err) {
    console.error('[orders] setFulfillment failed', err);
    return { ok: false };
  }
}


type TimelineEntry = { kind: 'comment' | 'event' | 'email'; text: string; author?: string; at?: string };

function authorName(user: NonNullable<Awaited<ReturnType<typeof getPayloadUser>>>): string {
  return user.name || user.email;
}

/** Append one entry to an order's timeline (preserving existing rows). */
async function appendTimeline(
  payload: Awaited<ReturnType<typeof getPayload>>,
  user: NonNullable<Awaited<ReturnType<typeof getPayloadUser>>>,
  orderId: number,
  entry: TimelineEntry,
): Promise<void> {
  const order = await payload.findByID({ collection: 'orders', id: orderId });
  const existing = (order.timeline ?? []).map((t) => ({ kind: t.kind, text: t.text, author: t.author, at: t.at }));
  const stamp = new Date().toISOString();
  await payload.update({
    collection: 'orders',
    id: orderId,
    user,
    overrideAccess: false,
    data: { timeline: [...existing, { ...entry, author: entry.author ?? authorName(user), at: stamp }] },
  });
}

export async function addComment(orderId: number, text: string): Promise<{ ok: boolean }> {
  const user = await getPayloadUser();
  if (!user) return { ok: false };
  const body = text.trim();
  if (!body) return { ok: false };
  const payload = await getPayload({ config });
  try {
    await appendTimeline(payload, user, orderId, { kind: 'comment', text: body });
    revalidatePath(`/admin/orders/${orderId}`);
    return { ok: true };
  } catch (err) {
    console.error('[orders] addComment failed', err);
    return { ok: false };
  }
}

export async function addTag(orderId: number, tag: string): Promise<{ ok: boolean; tags: string[] }> {
  const user = await getPayloadUser();
  if (!user) return { ok: false, tags: [] };
  const t = tag.trim();
  const payload = await getPayload({ config });
  try {
    const order = await payload.findByID({ collection: 'orders', id: orderId });
    const current = Array.isArray(order.tags) ? order.tags : [];
    if (!t || current.includes(t)) return { ok: true, tags: current };
    const tags = [...current, t];
    await payload.update({ collection: 'orders', id: orderId, user, overrideAccess: false, data: { tags } });
    revalidatePath(`/admin/orders/${orderId}`);
    return { ok: true, tags };
  } catch (err) {
    console.error('[orders] addTag failed', err);
    return { ok: false, tags: [] };
  }
}

export async function removeTag(orderId: number, tag: string): Promise<{ ok: boolean; tags: string[] }> {
  const user = await getPayloadUser();
  if (!user) return { ok: false, tags: [] };
  const payload = await getPayload({ config });
  try {
    const order = await payload.findByID({ collection: 'orders', id: orderId });
    const tags = (Array.isArray(order.tags) ? order.tags : []).filter((x) => x !== tag);
    await payload.update({ collection: 'orders', id: orderId, user, overrideAccess: false, data: { tags } });
    revalidatePath(`/admin/orders/${orderId}`);
    return { ok: true, tags };
  } catch (err) {
    console.error('[orders] removeTag failed', err);
    return { ok: false, tags: [] };
  }
}
