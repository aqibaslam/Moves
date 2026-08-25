'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import type { Product } from '@/payload-types';
import { createProduct, updateProduct, type ProductFormState } from './actions';
import { MediaInput } from './MediaInput';

const INITIAL: ProductFormState = {};

/** pence → a plain pounds string for a number input ("240000" → "2400"). */
function pounds(pence?: number | null): string {
  return pence == null ? '' : String(pence / 100);
}

/**
 * Full-page product editor (Shopify-style). Doubles as create and edit:
 * pass a `product` to edit it, omit it to create. Edit mode pre-fills every
 * field and submits to updateProduct with a hidden id.
 */
export function ProductEditor({ product }: { product?: Product }) {
  const router = useRouter();
  const editing = Boolean(product);
  const [state, action, pending] = useActionState(
    editing ? updateProduct : createProduct,
    INITIAL,
  );

  useEffect(() => {
    if (state.ok) router.push('/admin/products');
  }, [state.ok, router]);

  const tags = Array.isArray(product?.tags) ? product?.tags.join(', ') : '';

  return (
    <form className="pe" action={action}>
      {editing ? <input type="hidden" name="id" value={product!.id} /> : null}

      <div className="pe__bar">
        <Link className="pe__back" href="/admin/products" aria-label="Back to products">‹</Link>
        <h1 className="pe__heading">{editing ? product!.name : 'Add product'}</h1>
      </div>

      {state.error ? <p className="pe__error" role="alert">{state.error}</p> : null}

      <div className="pe__grid">
        <div className="pe__col">
          <section className="pe__card">
            <div className="pe__field">
              <label className="pe__label" htmlFor="name">Title</label>
              <input className="pe__input" id="name" name="name" placeholder="Moves Full" required autoFocus defaultValue={product?.name ?? ''} />
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="description">Description</label>
              <textarea className="pe__textarea" id="description" name="description" defaultValue={product?.description ?? ''}
                placeholder="Full arch treatment, start to finish — planned and signed by a GDC-registered dentist." />
            </div>
            <MediaInput name="media" existing={editing ? mediaThumbs(product!) : []} />
            <div className="pe__field">
              <label className="pe__label" htmlFor="category">Category</label>
              <input className="pe__input" id="category" name="category" placeholder="Clear aligners" defaultValue={product?.category ?? ''} />
            </div>
          </section>

          <section className="pe__card">
            <div className="pe__cardtitle">Pricing</div>
            <div className="pe__row2">
              <div className="pe__field">
                <label className="pe__label" htmlFor="price">Price</label>
                <div className="pe__prefix"><span>£</span>
                  <input className="pe__input" id="price" name="price" inputMode="decimal" placeholder="2400" required defaultValue={pounds(product?.pricePence)} />
                </div>
              </div>
              <div className="pe__field">
                <label className="pe__label" htmlFor="compareAt">Compare-at price</label>
                <div className="pe__prefix"><span>£</span>
                  <input className="pe__input" id="compareAt" name="compareAt" inputMode="decimal" placeholder="0.00" defaultValue={pounds(product?.compareAtPence)} />
                </div>
              </div>
            </div>
            <div className="pe__divider" />
            <label className="pe__check">
              <input type="checkbox" name="chargeTax" defaultChecked={product ? Boolean(product.chargeTax) : true} /> Charge tax on this product
            </label>
            <div className="pe__field" style={{ marginTop: 14 }}>
              <label className="pe__label" htmlFor="costPerItem">Cost per item</label>
              <div className="pe__prefix"><span>£</span>
                <input className="pe__input" id="costPerItem" name="costPerItem" inputMode="decimal" placeholder="0.00" defaultValue={pounds(product?.costPerItemPence)} />
              </div>
              <span className="pe__hint">Your cost — used for margin, never shown to patients.</span>
            </div>
          </section>

          <section className="pe__card">
            <div className="pe__cardtitle">Inventory</div>
            <label className="pe__check">
              <input type="checkbox" name="trackQuantity" defaultChecked={Boolean(product?.trackQuantity)} /> Track quantity
            </label>
            <div className="pe__row2" style={{ marginTop: 14 }}>
              <div className="pe__field">
                <label className="pe__label" htmlFor="quantity">Quantity</label>
                <input className="pe__input" id="quantity" name="quantity" inputMode="numeric" placeholder="0" defaultValue={product?.quantity ?? ''} />
              </div>
              <div className="pe__field">
                <label className="pe__label" htmlFor="sku">SKU</label>
                <input className="pe__input" id="sku" name="sku" placeholder="MV-FULL" defaultValue={product?.sku ?? ''} />
              </div>
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="barcode">Barcode (ISBN, UPC, GTIN…)</label>
              <input className="pe__input" id="barcode" name="barcode" defaultValue={product?.barcode ?? ''} />
            </div>
            <label className="pe__check">
              <input type="checkbox" name="continueSelling" defaultChecked={Boolean(product?.continueSellingWhenOutOfStock)} /> Continue selling when out of stock
            </label>
          </section>

          <section className="pe__card">
            <div className="pe__toggle">
              <div className="pe__cardtitle" style={{ marginBottom: 0 }}>Shipping</div>
              <label className="pe__check">
                <input type="checkbox" name="physicalProduct" defaultChecked={product ? Boolean(product.physicalProduct) : true} /> Physical product
              </label>
            </div>
            <div className="pe__field" style={{ marginTop: 14 }}>
              <label className="pe__label" htmlFor="weight">Weight (grams)</label>
              <input className="pe__input" id="weight" name="weight" inputMode="numeric" placeholder="0" defaultValue={product?.weightGrams ?? ''} />
            </div>
          </section>

          <section className="pe__card">
            <div className="pe__cardtitle">Search engine listing</div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="seoTitle">Page title</label>
              <input className="pe__input" id="seoTitle" name="seoTitle" placeholder="Defaults to the product title" defaultValue={product?.seoTitle ?? ''} />
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="seoDescription">Meta description</label>
              <textarea className="pe__textarea" id="seoDescription" name="seoDescription" style={{ minHeight: 80 }} defaultValue={product?.seoDescription ?? ''} />
            </div>
          </section>
        </div>

        <div className="pe__col">
          <section className="pe__card">
            <div className="pe__cardtitle">Status</div>
            <select className="pe__select" name="status" defaultValue={product ? (product.active ? 'active' : 'draft') : 'active'}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
            <span className="pe__hint" style={{ marginTop: 8, display: 'block' }}>
              Active products can be ordered. Draft hides them.
            </span>
          </section>

          <section className="pe__card">
            <div className="pe__cardtitle">Product organization</div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="handle">Handle (URL)</label>
              <input className="pe__input" id="handle" name="handle" placeholder="moves-full" defaultValue={product?.slug ?? ''} />
              <span className="pe__hint">Opens at /product/&lt;handle&gt;. Leave blank to derive from the title.</span>
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="productType">Type</label>
              <input className="pe__input" id="productType" name="productType" placeholder="Treatment plan" defaultValue={product?.productType ?? ''} />
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="vendor">Vendor</label>
              <input className="pe__input" id="vendor" name="vendor" placeholder="Moves" defaultValue={product?.vendor ?? ''} />
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="tags">Tags</label>
              <input className="pe__input" id="tags" name="tags" placeholder="aligners, popular" defaultValue={tags} />
              <span className="pe__hint">Comma-separated.</span>
            </div>
          </section>
        </div>
      </div>

      <div className="pe__foot">
        <button className="pe__save" type="submit" disabled={pending}>
          {pending ? 'Saving…' : editing ? 'Save changes' : 'Save'}
        </button>
      </div>
    </form>
  );
}

/** URLs of a product's already-uploaded images, for the edit preview. */
function mediaThumbs(product: Product): string[] {
  const urls: string[] = [];
  const img = product.image;
  if (img && typeof img === 'object' && 'url' in img && img.url) urls.push(img.url);
  for (const g of product.gallery ?? []) {
    const f = g.file;
    if (f && typeof f === 'object' && 'url' in f && f.url) urls.push(f.url);
  }
  return urls;
}
