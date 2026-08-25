import type { Metadata } from 'next';
import config from '@payload-config';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getPayload } from 'payload';
import type { Media, Order, Product } from '@/payload-types';
import { getAdminUser } from '../../../lib/auth';
import { StatusPill } from '../../StatusPill';
import { ORDER_STATUS_LABEL } from '../../../lib/data';
import { FulfillButton } from './FulfillButton';

export const metadata: Metadata = { title: 'Order' };
export const dynamic = 'force-dynamic';

const gbp = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(p / 100);
const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function productOf(p: unknown): Product | null {
  return p && typeof p === 'object' ? (p as Product) : null;
}
function imgUrl(p: Product | null): string | null {
  const m = p?.image;
  return m && typeof m === 'object' ? ((m as Media).url ?? null) : null;
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) redirect('/login');
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) notFound();

  const payload = await getPayload({ config });
  const order = (await payload.findByID({ collection: 'orders', id: numId, depth: 2 }).catch(() => null)) as Order | null;
  if (!order) notFound();

  const customer = order.customer && typeof order.customer === 'object' ? order.customer : null;
  const customerId = customer?.id ?? (typeof order.customer === 'number' ? order.customer : null);

  // How many orders this customer has placed.
  let orderCount = 1;
  if (customerId) {
    const c = await payload.count({ collection: 'orders', where: { customer: { equals: customerId } } });
    orderCount = c.totalDocs;
  }

  const lines = (order.lineItems ?? []).map((li) => {
    const p = productOf(li.product);
    return { name: p?.name ?? 'Product', sku: p?.sku ?? null, image: imgUrl(p), qty: li.quantity ?? 1, unit: li.unitPricePence ?? 0 };
  });
  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const shipping = order.shippingPence ?? 0;
  const total = order.amountPence ?? subtotal + shipping;
  const itemCount = lines.reduce((n, l) => n + l.qty, 0) || (order.product ? 1 : 0);
  const paid = order.status !== 'draft';
  const fulfilled = order.fulfillmentStatus === 'fulfilled';
  const addr = order.shippingAddress ?? {};
  const name = customer?.name ?? order.patientName ?? addr.name ?? '—';
  const email = customer?.email ?? order.patientEmail ?? '';
  const cAddr = customer?.address ?? {};

  const addressBlock = (
    <>
      <p>{name}</p>
      {(addr.line1 || cAddr.line1) ? <p>{addr.line1 || cAddr.line1}</p> : null}
      {(addr.line2 || cAddr.line2) ? <p>{addr.line2 || cAddr.line2}</p> : null}
      {(addr.city || cAddr.city) ? <p>{addr.city || cAddr.city}</p> : null}
      {(addr.postcode || cAddr.postcode) ? <p>{addr.postcode || cAddr.postcode}</p> : null}
      <p>{addr.country || cAddr.country || 'United Kingdom'}</p>
      {(addr.phone || customer?.phone) ? <p>{addr.phone || customer?.phone}</p> : null}
    </>
  );

  return (
    <>
      <header className="dash__head">
        <div className="od__titlerow">
          <Link className="pe__back" href="/admin/orders" aria-label="Back to orders">‹</Link>
          <h1 className="dash__title" style={{ fontSize: 26 }}>{order.reference}</h1>
          <StatusPill tone={order.status === 'draft' ? 'grey' : paid ? 'green' : 'blue'}>{paid ? 'Paid' : ORDER_STATUS_LABEL[order.status]}</StatusPill>
          <StatusPill tone={fulfilled ? 'green' : 'amber'}>{fulfilled ? 'Fulfilled' : 'Unfulfilled'}</StatusPill>
        </div>
        <Link className="dash__ghost" href={`/admin/orders/${order.id}/edit`}>Edit</Link>
      </header>
      <p className="dash__sub" style={{ marginTop: -16, marginBottom: 22 }}>{dateFmt.format(new Date(order.createdAt))}</p>

      <div className="od">
        <div className="od__main">
          <section className="dash__card">
            <div className="od__fhead">
              <StatusPill tone={fulfilled ? 'green' : 'amber'}>{fulfilled ? 'Fulfilled' : `Unfulfilled (${itemCount})`}</StatusPill>
              {order.clinic ? <span className="od__loc">📍 {order.clinic}</span> : null}
            </div>
            {lines.length === 0 ? (
              <p className="dash__empty">No line items.</p>
            ) : (
              <div className="od__items">
                {lines.map((l, i) => (
                  <div className="od__item" key={i}>
                    <div className="od__thumb">
                      {l.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.image} alt={l.name} />
                      ) : (
                        <span aria-hidden="true">🦷</span>
                      )}
                    </div>
                    <div className="od__iinfo">
                      <p className="od__iname">{l.name}</p>
                      {l.sku ? <p className="od__isku">{l.sku}</p> : null}
                    </div>
                    <div className="od__iqty">{gbp(l.unit)} × {l.qty}</div>
                    <div className="od__iline">{gbp(l.unit * l.qty)}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="od__factions">
              <FulfillButton orderId={order.id} fulfilled={fulfilled} />
            </div>
          </section>

          <section className="dash__card">
            <div className="od__paidhead"><StatusPill tone={paid ? 'green' : 'grey'}>{paid ? 'Paid' : 'Payment pending'}</StatusPill></div>
            <div className="od__pay">
              <div className="od__payrow"><span>Subtotal</span><span className="od__paymuted">{itemCount} item{itemCount === 1 ? '' : 's'}</span><span>{gbp(subtotal)}</span></div>
              <div className="od__payrow"><span>Shipping</span><span className="od__paymuted">{shipping === 0 ? 'Free' : ''}</span><span>{gbp(shipping)}</span></div>
              <div className="od__payrow od__paytotal"><span>Total</span><span /><span>{gbp(total)}</span></div>
              <div className="od__payrow"><span>{paid ? 'Paid' : 'Balance'}</span><span /><span>{gbp(paid ? total : 0)}</span></div>
            </div>
          </section>
        </div>

        <aside className="od__side">
          <section className="dash__card">
            <div className="od__sidehead">Customer</div>
            {customerId ? (
              <Link className="dash__rowlink" href={`/admin/customers/${customerId}`}>{name}</Link>
            ) : (
              <p className="od__iname">{name}</p>
            )}
            <p className="od__paymuted" style={{ marginTop: 2 }}>{orderCount} order{orderCount === 1 ? '' : 's'}</p>
            <div className="od__sidesub">Contact information</div>
            {email ? <a className="dash__rowlink" href={`mailto:${email}`}>{email}</a> : <p className="od__paymuted">—</p>}
            <div className="od__sidesub">Shipping address</div>
            <div className="od__addr">{addressBlock}</div>
            <div className="od__sidesub">Billing address</div>
            <div className="od__addr">{addressBlock}</div>
          </section>

          <section className="dash__card">
            <div className="od__sidehead">Tags</div>
            {Array.isArray(order.tags) && order.tags.length ? (
              <div className="od__tags">{order.tags.map((t) => <span className="dash__pill dash__pill--grey" key={t}>{t}</span>)}</div>
            ) : (
              <p className="od__paymuted">No tags. <Link className="dash__rowlink" href={`/admin/orders/${order.id}/edit`}>Add</Link></p>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
