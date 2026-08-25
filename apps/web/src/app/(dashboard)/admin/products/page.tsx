import type { Metadata } from 'next';
import { StatusPill } from '../StatusPill';
import { formatPence, listProducts } from '../../lib/data';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Products' };

export default async function ProductsPage() {
  const products = await listProducts();
  const live = products.filter((p) => p.active).length;

  return (
    <>
      <header className="dash__head">
        <div>
          <h1 className="dash__title">Products</h1>
          <p className="dash__sub">Treatment plans patients can order.</p>
        </div>
        <Link className="dash__primary" href="/admin/products/new">Add product</Link>
      </header>

      <section className="dash__card" aria-label="Products">
        <div className="dash__cardhead">
          <h2 className="dash__cardtitle">All products</h2>
          <p className="dash__cardnote">
            {products.length} total · {live} available
          </p>
        </div>

        {products.length === 0 ? (
          <p className="dash__empty">
            No products yet. Use <strong>Add product</strong> to create the first one.
          </p>
        ) : (
          <div className="dash__tablewrap">
            <table className="dash__table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="dash__num">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="dash__name"><Link className="dash__rowlink" href={`/admin/products/${p.id}`}>{p.name}</Link></td>
                    <td className="dash__muted">{p.description || '—'}</td>
                    <td>
                      <StatusPill tone={p.active ? 'green' : 'grey'}>
                        {p.active ? 'Available' : 'Hidden'}
                      </StatusPill>
                    </td>
                    <td className="dash__num">{formatPence(p.pricePence)}</td>
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
