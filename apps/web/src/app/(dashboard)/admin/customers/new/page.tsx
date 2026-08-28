import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/auth';
import { CustomerForm } from '../CustomerForm';

export const metadata: Metadata = { title: 'Add customer' };
export const dynamic = 'force-dynamic';

export default async function NewCustomerPage() {
  if (!(await getAdminUser())) redirect('/login');
  return (
    <>
      <header className="dash__head">
        <div className="od__titlerow">
          <Link className="pe__back" href="/admin/customers" aria-label="Back to customers">‹</Link>
          <h1 className="dash__title" style={{ fontSize: 26 }}>Add customer</h1>
        </div>
      </header>
      <div style={{ maxWidth: 560 }}>
        <CustomerForm />
      </div>
    </>
  );
}
