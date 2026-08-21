import type { Metadata } from 'next';
import { StatusPill } from '../StatusPill';
import { ORDER_STATUS_LABEL, formatPence, listOrders } from '../../lib/data';
import type { Order } from '@/payload-types';

export const metadata: Metadata = { title: 'Orders' };

const TONE: Record<NonNullable<Order['status']>, 'green' | 'blue' | 'amber' | 'grey' | 'coral'> = {
  placed: 'blue',
  in_production: 'amber',
  shipped: 'blue',
  delivered: 'green',
  cancelled: 'grey',
};

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** depth:1 resolves the relationship to an object; it stays an id if unpopulated. */
function productName(product: Order['product']): string {
  return typeof product === 'object' && product !== null ? product.name : '—';
}

export default async function OrdersPage() {
  const orders = await listOrders();
  const billable = orders.filter((o) => o.status !== 'cancelled');
  const total = billable.reduce((sum, o) => sum + o.amountPence, 0);

  return (
    <>
      <header className="dash__head">
        <div>
          <h1 className="dash__title">Orders</h1>
          <p className="dash__sub">Treatment plans ordered through the practice.</p>
        </div>
      </header>

      <section className="dash__card" aria-label="Orders">
        <div className="dash__cardhead">
          <h2 className="dash__cardtitle">All orders</h2>
          <p className="dash__cardnote">
            {billable.length} active · {formatPence(total)} total
          </p>
        </div>

        {orders.length === 0 ? (
          <p className="dash__empty">
            No orders yet. They’ll appear here as patients order a plan.
          </p>
        ) : (
          <div className="dash__tablewrap">
            <table className="dash__table">
              <thead>
                <tr>
                  <th scope="col">Reference</th>
                  <th scope="col">Patient</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Dentist</th>
                  <th scope="col">Placed</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="dash__num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="dash__ref">{o.reference}</td>
                    <td className="dash__name">{o.patientName}</td>
                    <td>{productName(o.product)}</td>
                    <td className="dash__muted">{o.dentist || '—'}</td>
                    <td className="dash__muted dash__when">
                      {dateFmt.format(new Date(o.createdAt))}
                    </td>
                    <td>
                      <StatusPill tone={TONE[o.status]}>{ORDER_STATUS_LABEL[o.status]}</StatusPill>
                    </td>
                    <td className="dash__num">{formatPence(o.amountPence)}</td>
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
