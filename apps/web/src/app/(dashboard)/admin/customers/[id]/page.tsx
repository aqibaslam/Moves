import type { Metadata } from 'next';
import config from '@payload-config';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getPayload } from 'payload';
import { getAdminUser } from '../../../lib/auth';
import { StatusPill } from '../../StatusPill';
import { ORDER_STATUS_LABEL } from '../../../lib/data';
import { CustomerForm } from '../CustomerForm';

export const metadata: Metadata = { title: 'Customer' };
export const dynamic = 'force-dynamic';

const gbp = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(p / 100);
const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) redirect('/login');
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) notFound();

  const payload = await getPayload({ config });
  const customer = await payload.findByID({ collection: 'customers', id: numId }).catch(() => null);
  if (!customer) notFound();

  const orders = await payload.find({ collection: 'orders', where: { customer: { equals: numId } }, sort: '-createdAt', limit: 100 });
  const spent = orders.docs.filter((o) => o.status !== 'cancelled' && o.status !== 'draft').reduce((s, o) => s + (o.amountPence ?? 0), 0);
  const a = customer.address ?? {};

  return (
    <>
      <header className="dash__head">
        <div className="od__titlerow">
          <Link className="pe__back" href="/admin/customers" aria-label="Back to customers">‹</Link>
          <h1 className="dash__title" style={{ fontSize: 26 }}>{customer.name}</h1>
        </div>
      </header>

      <div className="od">
        <div className="od__main">
          <section className="dash__card">
            <div className="dash__cardhead">
              <h2 className="dash__cardtitle">Orders</h2>
              <p className="dash__cardnote">{orders.totalDocs} order{orders.totalDocs === 1 ? '' : 's'} · {gbp(spent)} spent</p>
            </div>
            {orders.docs.length === 0 ? (
              <p className="dash__empty">No orders yet.</p>
            ) : (
              <div className="dash__tablewrap">
                <table className="dash__table">
                  <thead><tr><th>Reference</th><th>Placed</th><th>Status</th><th className="dash__num">Total</th></tr></thead>
                  <tbody>
                    {orders.docs.map((o) => (
                      <tr key={o.id}>
                        <td className="dash__ref"><Link className="dash__rowlink" href={`/admin/orders/${o.id}`}>{o.reference}</Link></td>
                        <td className="dash__muted dash__when">{dateFmt.format(new Date(o.createdAt))}</td>
                        <td><StatusPill tone={o.status === 'draft' ? 'grey' : 'blue'}>{ORDER_STATUS_LABEL[o.status]}</StatusPill></td>
                        <td className="dash__num">{gbp(o.amountPence ?? 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="od__side">
          <CustomerForm
            initial={{
              id: customer.id,
              name: customer.name,
              email: customer.email,
              phone: customer.phone ?? '',
              line1: a.line1 ?? '',
              line2: a.line2 ?? '',
              city: a.city ?? '',
              postcode: a.postcode ?? '',
              country: a.country ?? 'United Kingdom',
              notes: customer.notes ?? '',
            }}
          />
        </aside>
      </div>
    </>
  );
}
