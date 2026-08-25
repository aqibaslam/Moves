import type { Metadata } from 'next';
import config from '@payload-config';
import Link from 'next/link';
import { getPayload } from 'payload';
import { getPayloadUser } from '../../lib/auth';

export const metadata: Metadata = { title: 'Customers' };
export const dynamic = 'force-dynamic';

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default async function CustomersPage() {
  const user = await getPayloadUser();
  const payload = await getPayload({ config });
  const res = await payload.find({ collection: 'customers', limit: 200, sort: '-createdAt', user: user ?? undefined, overrideAccess: false });

  // Order counts per customer.
  const counts = new Map<number, number>();
  await Promise.all(
    res.docs.map(async (c) => {
      const n = await payload.count({ collection: 'orders', where: { customer: { equals: c.id } } });
      counts.set(c.id as number, n.totalDocs);
    }),
  );

  return (
    <>
      <header className="dash__head">
        <div>
          <h1 className="dash__title">Customers</h1>
          <p className="dash__sub">Everyone who has placed an order or been added by hand.</p>
        </div>
      </header>

      <section className="dash__card" aria-label="Customers">
        <div className="dash__cardhead">
          <h2 className="dash__cardtitle">All customers</h2>
          <p className="dash__cardnote">{res.totalDocs} total</p>
        </div>
        {res.docs.length === 0 ? (
          <p className="dash__empty">No customers yet. They appear when an order is placed or created.</p>
        ) : (
          <div className="dash__tablewrap">
            <table className="dash__table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Orders</th>
                  <th scope="col">Added</th>
                </tr>
              </thead>
              <tbody>
                {res.docs.map((c) => (
                  <tr key={c.id}>
                    <td className="dash__name"><Link className="dash__rowlink" href={`/admin/customers/${c.id}`}>{c.name}</Link></td>
                    <td className="dash__muted">{c.email}</td>
                    <td className="dash__muted">{c.phone || '—'}</td>
                    <td className="dash__muted">{counts.get(c.id as number) ?? 0}</td>
                    <td className="dash__muted dash__when">{dateFmt.format(new Date(c.createdAt))}</td>
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
