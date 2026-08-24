'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { createProduct, type ProductFormState } from './actions';
import { MediaInput } from './MediaInput';

const INITIAL: ProductFormState = {};

function Switch({ name, defaultChecked }: { name: string; defaultChecked?: boolean }) {
  return (
    <label className="pe__switch">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span aria-hidden="true" />
    </label>
  );
}

/**
 * Full-page product editor, laid out like the Shopify "Add product" screen:
 * a wide main column (details, media, pricing, inventory, shipping, SEO) and a
 * narrow sidebar (status, organization). Submits to the createProduct action.
 */
export function ProductEditor() {
  const router = useRouter();
  const [state, action, pending] = useActionState(createProduct, INITIAL);

  // On success, go back to the list where the new row appears.
  useEffect(() => {
    if (state.ok) router.push('/admin/products');
  }, [state.ok, router]);

  return (
    <form className="pe" action={action}>
      <div className="pe__bar">
        <Link className="pe__back" href="/admin/products" aria-label="Back to products">
          ‹
        </Link>
        <h1 className="pe__heading">Add product</h1>
      </div>

      {state.error ? <p className="pe__error" role="alert">{state.error}</p> : null}

      <div className="pe__grid">
        {/* ── main column ─────────────────────────────────── */}
        <div className="pe__col">
          <section className="pe__card">
            <div className="pe__field">
              <label className="pe__label" htmlFor="name">Title</label>
              <input className="pe__input" id="name" name="name" placeholder="Moves Full" required autoFocus />
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="description">Description</label>
              <textarea className="pe__textarea" id="description" name="description"
                placeholder="Full arch treatment, start to finish — planned and signed by a GDC-registered dentist." />
            </div>
            <MediaInput name="media" />
            <div className="pe__field">
              <label className="pe__label" htmlFor="category">Category</label>
              <input className="pe__input" id="category" name="category" placeholder="Clear aligners" />
            </div>
          </section>

          <section className="pe__card">
            <div className="pe__cardtitle">Pricing</div>
            <div className="pe__row2">
              <div className="pe__field">
                <label className="pe__label" htmlFor="price">Price</label>
                <div className="pe__prefix">
                  <span>£</span>
                  <input className="pe__input" id="price" name="price" inputMode="decimal" placeholder="2400" required />
                </div>
              </div>
              <div className="pe__field">
                <label className="pe__label" htmlFor="compareAt">Compare-at price</label>
                <div className="pe__prefix">
                  <span>£</span>
                  <input className="pe__input" id="compareAt" name="compareAt" inputMode="decimal" placeholder="0.00" />
                </div>
              </div>
            </div>
            <div className="pe__divider" />
            <label className="pe__check">
              <input type="checkbox" name="chargeTax" defaultChecked /> Charge tax on this product
            </label>
            <div className="pe__field" style={{ marginTop: 14 }}>
              <label className="pe__label" htmlFor="costPerItem">Cost per item</label>
              <div className="pe__prefix">
                <span>£</span>
                <input className="pe__input" id="costPerItem" name="costPerItem" inputMode="decimal" placeholder="0.00" />
              </div>
              <span className="pe__hint">Your cost — used for margin, never shown to patients.</span>
            </div>
          </section>

          <section className="pe__card">
            <div className="pe__cardtitle">Inventory</div>
            <label className="pe__check">
              <input type="checkbox" name="trackQuantity" /> Track quantity
            </label>
            <div className="pe__row2" style={{ marginTop: 14 }}>
              <div className="pe__field">
                <label className="pe__label" htmlFor="quantity">Quantity</label>
                <input className="pe__input" id="quantity" name="quantity" inputMode="numeric" placeholder="0" />
              </div>
              <div className="pe__field">
                <label className="pe__label" htmlFor="sku">SKU</label>
                <input className="pe__input" id="sku" name="sku" placeholder="MV-FULL" />
              </div>
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="barcode">Barcode (ISBN, UPC, GTIN…)</label>
              <input className="pe__input" id="barcode" name="barcode" />
            </div>
            <label className="pe__check">
              <input type="checkbox" name="continueSelling" /> Continue selling when out of stock
            </label>
          </section>

          <section className="pe__card">
            <div className="pe__toggle">
              <div className="pe__cardtitle" style={{ marginBottom: 0 }}>Shipping</div>
              <label className="pe__check">
                <input type="checkbox" name="physicalProduct" defaultChecked /> Physical product
              </label>
            </div>
            <div className="pe__field" style={{ marginTop: 14 }}>
              <label className="pe__label" htmlFor="weight">Weight (grams)</label>
              <input className="pe__input" id="weight" name="weight" inputMode="numeric" placeholder="0" />
            </div>
          </section>

          <section className="pe__card">
            <div className="pe__cardtitle">Search engine listing</div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="seoTitle">Page title</label>
              <input className="pe__input" id="seoTitle" name="seoTitle" placeholder="Defaults to the product title" />
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="seoDescription">Meta description</label>
              <textarea className="pe__textarea" id="seoDescription" name="seoDescription" style={{ minHeight: 80 }} />
            </div>
          </section>
        </div>

        {/* ── sidebar ─────────────────────────────────────── */}
        <div className="pe__col">
          <section className="pe__card">
            <div className="pe__cardtitle">Status</div>
            <select className="pe__select" name="status" defaultValue="active">
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
              <input className="pe__input" id="handle" name="handle" placeholder="moves-full" />
              <span className="pe__hint">Opens at /product/&lt;handle&gt;. Leave blank to derive from the title.</span>
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="productType">Type</label>
              <input className="pe__input" id="productType" name="productType" placeholder="Treatment plan" />
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="vendor">Vendor</label>
              <input className="pe__input" id="vendor" name="vendor" placeholder="Moves" />
            </div>
            <div className="pe__field">
              <label className="pe__label" htmlFor="tags">Tags</label>
              <input className="pe__input" id="tags" name="tags" placeholder="aligners, popular" />
              <span className="pe__hint">Comma-separated.</span>
            </div>
          </section>
        </div>
      </div>

      <div className="pe__foot">
        <button className="pe__save" type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
