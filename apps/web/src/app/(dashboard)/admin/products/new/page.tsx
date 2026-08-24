import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/auth';
import { ProductEditor } from '../ProductEditor';

export const metadata: Metadata = { title: 'Add product' };
export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  // Second line of defence behind the proxy redirect.
  if (!(await getAdminUser())) redirect('/login');
  return <ProductEditor />;
}
