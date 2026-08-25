'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { saveOrder, type OrderInput } from './actions';

type ProductOpt = { id: number; name: string; pricePence: number };
type Line = { productId: number; quantity: number };

export type OrderInitial = {
  id: number;
  reference: string;
  customer: {
    name: string; email: string; phone?: string;
    line1?: string; line2?: string; city?: string; postcode?: string; country?: string;
  };
  lines: Line[];
  status: 'draft' | 'placed';
  tags: string;
  notes: string;
};

const gbp = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(p / 100);

export function OrderEditor({ products, initial }: { products: ProductOpt[]; initial?: OrderInitial }) {
  const router = useRouter();
  const editing = Boolean(initial);
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const [c, setC] = useState(initial?.customer ?? { name: '', email: '', phone: '', line1: '', line2: '', city: '', postcode: '', country: 'United Kingdom' });
  const [lines, setLines] = useState<Line[]>(initial?.lines ?? []);
  const [status, setStatus] = useState<'draft' | 'placed'>(initial?.status ?? 'draft');
  const [tags, setTags] = useState(initial?.tags ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [pick, setPick] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = lines.reduce((s, l) => s + (byId.get(l.productId)?.pricePence ?? 0) * l.quantity, 0);

  const addProduct = (id: number) => {
    if (!id) return;
    setLines((prev) => {
      const ex = prev.find((l) => l.productId === id);
      return ex ? prev.map((l) => (l.productId === id ? { ...l, quantity: l.quantity + 1 } : l)) : [...prev, { productId: id, quantity: 1 }];
    });
    setPick('');
  };
  const setQty = (id: number, q: number) => setLines((prev) => (q <= 0 ? prev.filter((l) => l.productId !== id) : prev.map((l) => (l.productId === id ? { ...l, quantity: q } : l))));

  async function submit(finalStatus: 'draft' | 'placed') {
    setPending(true); setError(null);
    const payload: OrderInput = {
      id: initial?.id,
      customer: c,
      lines,
      status: finalStatus,
      tags,
      notes,
    };
    const res = await saveOrder(payload);
    setPending(false);
    if (res.ok) router.push('/admin/orders');
    else setError(res.error);
  }

  const set = (k: keyof typeof c) => (e: React.ChangeEvent<HTMLInputElement>) => setC({ ...c, [k]: e.target.value });

  return (
    <div className="pe">
      <div className="pe__bar">
        <Link className="pe__back" href="/admin/orders" aria-label="Back to orders">‹</Link>
        <h1 className="pe__heading">{editing ? `Order ${initial!.reference}` : 'Create order'}</h1>
      </div>

      {error ? <p className="pe__error" role="alert">{error}</p> : null}

      <div className="pe__grid">
        <div className="pe__col">
          <section className="pe__card">
            <div className="pe__cardtitle">Products</div>
            <div className="pe__field">
              <select className="pe__select" value={pick} onChange={(e) => addProduct(Number(e.target.value))}>
                <option value="">+ Add a product…</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {gbp(p.pricePence)}</option>)}
              </select>
            </div>
            {lines.length === 0 ? (
              <p className="pe__hint">No products yet. Pick one above.</p>
            ) : (
              <div className="oe__lines">
                {lines.map((l) => {
                  const p = byId.get(l.productId);
                  if (!p) return null;
                  return (
                    <div className="oe__line" key={l.productId}>
                      <span className="oe__lname">{p.name}</span>
                      <span className="oe__lunit">{gbp(p.pricePence)}</span>
                      <div className="oe__qty">
                        <button type="button" onClick={() => setQty(l.productId, l.quantity - 1)} aria-label="Decrease">−</button>
                        <span>{l.quantity}</span>
                        <button type="button" onClick={() => setQty(l.productId, l.quantity + 1)} aria-label="Increase">+</button>
                      </div>
                      <span className="oe__ltot">{gbp(p.pricePence * l.quantity)}</span>
                      <button type="button" className="oe__rm" onClick={() => setQty(l.productId, 0)} aria-label="Remove">×</button>
                    </div>
                  );
                })}
                <div className="oe__total"><span>Total</span><strong>{gbp(total)}</strong></div>
              </div>
            )}
          </section>

          <section className="pe__card">
            <div className="pe__cardtitle">Notes</div>
            <textarea className="pe__textarea" style={{ minHeight: 70 }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal note about this order" />
          </section>
        </div>

        <div className="pe__col">
          <section className="pe__card">
            <div className="pe__cardtitle">Customer</div>
            <div className="pe__field"><label className="pe__label">Name</label><input className="pe__input" value={c.name} onChange={set('name')} placeholder="Jane Doe" /></div>
            <div className="pe__field"><label className="pe__label">Email</label><input className="pe__input" type="email" value={c.email} onChange={set('email')} placeholder="jane@example.com" /></div>
            <div className="pe__field"><label className="pe__label">Phone</label><input className="pe__input" value={c.phone ?? ''} onChange={set('phone')} placeholder="07700 900000" /></div>
            <div className="pe__divider" />
            <div className="pe__field"><label className="pe__label">Address line 1</label><input className="pe__input" value={c.line1 ?? ''} onChange={set('line1')} /></div>
            <div className="pe__field"><label className="pe__label">Address line 2</label><input className="pe__input" value={c.line2 ?? ''} onChange={set('line2')} /></div>
            <div className="pe__row2">
              <div className="pe__field"><label className="pe__label">City</label><input className="pe__input" value={c.city ?? ''} onChange={set('city')} /></div>
              <div className="pe__field"><label className="pe__label">Postcode</label><input className="pe__input" value={c.postcode ?? ''} onChange={set('postcode')} /></div>
            </div>
            <div className="pe__field"><label className="pe__label">Country</label><input className="pe__input" value={c.country ?? ''} onChange={set('country')} /></div>
            <span className="pe__hint">Matched by email — an existing customer is updated, a new one is created.</span>
          </section>

          <section className="pe__card">
            <div className="pe__cardtitle">Status &amp; tags</div>
            <div className="pe__field">
              <label className="pe__label">Status</label>
              <select className="pe__select" value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'placed')}>
                <option value="draft">Draft</option>
                <option value="placed">Placed</option>
              </select>
            </div>
            <div className="pe__field"><label className="pe__label">Tags</label><input className="pe__input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="customer_call" /></div>
          </section>
        </div>
      </div>

      <div className="pe__foot" style={{ gap: 10 }}>
        <button className="pe__ghost" type="button" disabled={pending} onClick={() => submit('draft')}>Save as draft</button>
        <button className="pe__save" type="button" disabled={pending} onClick={() => submit('placed')}>
          {pending ? 'Saving…' : editing ? 'Save order' : 'Create order'}
        </button>
      </div>
    </div>
  );
}
