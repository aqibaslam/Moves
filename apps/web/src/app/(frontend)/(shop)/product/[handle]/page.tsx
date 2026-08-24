import type { Metadata } from 'next';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import type { Media, Product } from '@/payload-types';
import { AddToCart } from './AddToCart';

export const dynamic = 'force-dynamic';

/** Resolve a media relationship (id | object) to a usable URL. */
function mediaUrl(m: Product['image']): string | null {
  return m && typeof m === 'object' ? ((m as Media).url ?? null) : null;
}

function gbp(pence: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
}

async function getProduct(handle: string): Promise<Product | null> {
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: handle }, active: { equals: true } },
    depth: 1,
    limit: 1,
  });
  return res.docs[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: 'Product not found' };
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description || undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const primary = mediaUrl(product.image);
  const gallery = (product.gallery ?? [])
    .map((g) => mediaUrl(g.file))
    .filter((u): u is string => Boolean(u));
  const images = [primary, ...gallery].filter((u): u is string => Boolean(u));

  return (
    <div className="pp">
      <div className="pp__grid">
        <div>
          <div className={`pp__media ${images.length ? '' : 'pp__media--empty'}`}>
            {images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt={product.name} />
            ) : (
              <span aria-hidden="true">🦷</span>
            )}
          </div>
          {images.length > 1 ? (
            <div className="pp__thumbs">
              {images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <span className="pp__thumb" key={src}><img src={src} alt="" /></span>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          {product.category ? <p className="pp__eyebrow">{product.category}</p> : null}
          <h1 className="pp__title">{product.name}</h1>
          <div className="pp__prices">
            <span className="pp__price">{gbp(product.pricePence)}</span>
            {product.compareAtPence && product.compareAtPence > product.pricePence ? (
              <span className="pp__compare">{gbp(product.compareAtPence)}</span>
            ) : null}
          </div>
          {product.description ? <p className="pp__desc">{product.description}</p> : null}

          <AddToCart
            product={{
              id: product.id,
              handle: product.slug ?? String(product.id),
              name: product.name,
              pricePence: product.pricePence,
              image: primary,
            }}
          />

          {product.vendor ? <p className="pp__meta">Sold by {product.vendor}</p> : null}
        </div>
      </div>
    </div>
  );
}
