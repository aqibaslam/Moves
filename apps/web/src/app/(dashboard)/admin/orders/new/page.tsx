import type { Metadata } from 'next';
import config from '@payload-config';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import { getAdminUser } from '../../../lib/auth';
import { OrderEditor } from '../OrderEditor';

export const metadata: Metadata = { title: 'Create order' };
export const dynamic = 'force-dynamic';

export default async function NewOrderPage() {
  if (!(await getAdminUser())) redirect('/login');
  const payload = await getPayload({ config });
  const res = await payload.find({ collection: 'products', where: { active: { equals: true } }, limit: 200, sort: 'name' });
  const products = res.docs.map((p) => ({ id: p.id, name: p.name, pricePence: p.pricePence }));
  return <OrderEditor products={products} />;
}
