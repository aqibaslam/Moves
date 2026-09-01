import type { Metadata } from 'next';
import config from '@payload-config';
import Link from 'next/link';
import { getPayload } from 'payload';
import type { Media, Product } from '@/payload-types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Shop',
  description: 'Clear-aligner treatment plans and add-ons from Moves.',
};

const gbp = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(p / 100);

function img(p: Product): string | null {
  const m = p.image;
  return m && typeof m === 'object' ? ((m as Media).url ?? null) : null;
}

export default async function ShopPage() {
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: 'products',
    where: { active: { equals: true } },
    sort: 'sortOrder',
    limit: 100,
    depth: 1,
  });
  const products = res.docs;

  return (
    <div className="sp">
      <header className="sp__hero">
        <p className="pp__eyebrow">The Moves store</p>
        <h1 className="sp__title">Treatment, made simple.</h1>
        <p className="sp__sub">
          Clear-aligner plans and add-ons — planned in person, signed by a named, GDC-registered dentist.
        </p>
      </header>

      {products.length === 0 ? (
        <p className="sp__empty">No products are available right now. Please check back soon.</p>
      ) : (
        <div className="sp__grid">
          {products.map((p) => {
            const src = img(p);
            const handle = p.slug ?? String(p.id);
            const onSale = p.compareAtPence && p.compareAtPence > p.pricePence;
            return (
              <Link key={p.id} href={`/product/${handle}`} className="sp__card">
                <div className={`sp__media ${src ? '' : 'sp__media--empty'}`}>
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={p.name} />
                  ) : (
                    <span aria-hidden="true">🦷</span>
                  )}
                  {onSale ? <span className="sp__sale">Sale</span> : null}
                </div>
                <div className="sp__info">
                  {p.category ? <p className="sp__cat">{p.category}</p> : null}
                  <p className="sp__name">{p.name}</p>
                  <p className="sp__price">
                    {gbp(p.pricePence)}
                    {onSale ? <span className="sp__was">{gbp(p.compareAtPence!)}</span> : null}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
