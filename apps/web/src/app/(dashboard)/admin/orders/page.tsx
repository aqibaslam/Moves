import type { Metadata } from 'next';
import Link from 'next/link';
import { StatusPill } from '../StatusPill';
import { ORDER_STATUS_LABEL, formatPence, listOrders } from '../../lib/data';
import type { Order } from '@/payload-types';

export const metadata: Metadata = { title: 'Orders' };

const TONE: Record<NonNullable<Order['status']>, 'green' | 'blue' | 'amber' | 'grey' | 'coral'> = {
  draft: 'grey',
  placed: 'blue',
  in_production: 'amber',
  shipped: 'blue',
  delivered: 'green',
  cancelled: 'grey',
};

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function itemCount(o: Order): number {
  if (o.lineItems?.length) return o.lineItems.reduce((n, li) => n + (li.quantity ?? 1), 0);
  return o.product ? 1 : 0;
}

export default async function OrdersPage() {
  const orders = await listOrders();
  const active = orders.filter((o) => o.status !== 'cancelled');
  const total = active.reduce((sum, o) => sum + (o.amountPence ?? 0), 0);

  return (
    <>
      <header className="dash__head">
        <div>
          <h1 className="dash__title">Orders</h1>
          <p className="dash__sub">Orders from the site and ones you create by hand.</p>
        </div>
        <Link className="dash__primary" href="/admin/orders/new">Create order</Link>
      </header>

      <section className="dash__card" aria-label="Orders">
        <div className="dash__cardhead">
          <h2 className="dash__cardtitle">All orders</h2>
          <p className="dash__cardnote">{active.length} active · {formatPence(total)} total</p>
        </div>

        {orders.length === 0 ? (
          <p className="dash__empty">No orders yet. Use <strong>Create order</strong>, or they’ll arrive from the site.</p>
        ) : (
          <div className="dash__tablewrap">
            <table className="dash__table">
              <thead>
                <tr>
                  <th scope="col">Reference</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Items</th>
                  <th scope="col">Placed</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="dash__num">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="dash__ref"><Link className="dash__rowlink" href={`/admin/orders/${o.id}`}>{o.reference}</Link></td>
                    <td className="dash__name">{o.patientName}</td>
                    <td className="dash__muted">{itemCount(o)}</td>
                    <td className="dash__muted dash__when">{dateFmt.format(new Date(o.createdAt))}</td>
                    <td><StatusPill tone={TONE[o.status]}>{ORDER_STATUS_LABEL[o.status]}</StatusPill></td>
                    <td className="dash__num">{formatPence(o.amountPence ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
