import type { Metadata } from 'next';
import config from '@payload-config';
import { notFound, redirect } from 'next/navigation';
import { getPayload } from 'payload';
import { getAdminUser } from '../../../lib/auth';
import { OrderEditor, type OrderInitial } from '../OrderEditor';

export const metadata: Metadata = { title: 'Order' };
export const dynamic = 'force-dynamic';

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) redirect('/login');
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) notFound();

  const payload = await getPayload({ config });
  const order = await payload.findByID({ collection: 'orders', id: numId, depth: 1 }).catch(() => null);
  if (!order) notFound();
  const productsRes = await payload.find({ collection: 'products', where: { active: { equals: true } }, limit: 200, sort: 'name' });
  const products = productsRes.docs.map((p) => ({ id: p.id, name: p.name, pricePence: p.pricePence }));

  const cust = typeof order.customer === 'object' && order.customer ? order.customer : null;
  const addr = order.shippingAddress ?? {};
  const lines = (order.lineItems ?? []).map((li) => ({
    productId: typeof li.product === 'object' && li.product ? li.product.id : (li.product as number),
    quantity: li.quantity ?? 1,
  }));

  const initial: OrderInitial = {
    id: order.id,
    reference: order.reference ?? String(order.id),
    customer: {
      name: cust?.name ?? order.patientName ?? addr.name ?? '',
      email: cust?.email ?? order.patientEmail ?? '',
      phone: cust?.phone ?? order.patientPhone ?? addr.phone ?? '',
      line1: cust?.address?.line1 ?? addr.line1 ?? '',
      line2: cust?.address?.line2 ?? addr.line2 ?? '',
      city: cust?.address?.city ?? addr.city ?? '',
      postcode: cust?.address?.postcode ?? addr.postcode ?? '',
      country: cust?.address?.country ?? addr.country ?? 'United Kingdom',
    },
    lines,
    status: order.status === 'draft' ? 'draft' : 'placed',
    tags: Array.isArray(order.tags) ? order.tags.join(', ') : '',
    notes: order.notes ?? '',
  };

  return <OrderEditor products={products} initial={initial} />;
}
