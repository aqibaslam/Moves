import type { Metadata } from 'next';
import config from '@payload-config';
import { notFound, redirect } from 'next/navigation';
import { getPayload } from 'payload';
import { getAdminUser } from '../../../lib/auth';
import { ProductEditor } from '../ProductEditor';

export const metadata: Metadata = { title: 'Edit product' };
export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) redirect('/login');
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) notFound();

  const payload = await getPayload({ config });
  const product = await payload.findByID({ collection: 'products', id: numId, depth: 1 }).catch(() => null);
  if (!product) notFound();

  return <ProductEditor product={product} />;
}
