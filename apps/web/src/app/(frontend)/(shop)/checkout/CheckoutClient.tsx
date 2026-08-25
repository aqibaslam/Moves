'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatPence, useCart } from '../cart/CartContext';
import { placeOrder } from './actions';

export function CheckoutClient() {
  const { lines, subtotalPence, clear } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  if (done) {
    return (
      <div className="co__done">
        <h1>Order placed 🎉</h1>
        <p>Thanks — your reference: <strong>{done}</strong>.</p>
        <p style={{ marginTop: 16 }}><Link href="/" className="cd__continue">Back to home</Link></p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="co__empty">
        <p>Your cart is empty.</p>
        <p style={{ marginTop: 12 }}><Link href="/" className="cd__continue">Continue shopping</Link></p>
      </div>
    );
  }

  async function submit(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await placeOrder({
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      lines: lines.map((l) => ({ id: l.id, qty: l.qty })),
    });
    setPending(false);
    if (res.ok) {
      clear();
      setDone(res.reference);
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="co__grid">
      <form className="co__card" action={submit}>
        <h2 style={{ fontWeight: 700, marginBottom: 16, color: '#04143a' }}>Your details</h2>
        {error ? <p className="co__error" role="alert">{error}</p> : null}
        <div className="co__field">
          <label className="co__label" htmlFor="name">Full name</label>
          <input className="co__input" id="name" name="name" required autoFocus />
        </div>
        <div className="co__field">
          <label className="co__label" htmlFor="email">Email</label>
          <input className="co__input" id="email" name="email" type="email" required />
        </div>
        <div className="co__field">
          <label className="co__label" htmlFor="phone">Phone (optional)</label>
          <input className="co__input" id="phone" name="phone" />
        </div>
        <button className="co__place" type="submit" disabled={pending}>
          {pending ? 'Placing order…' : `Place order · ${formatPence(subtotalPence)}`}
        </button>
      </form>

      <div className="co__card">
        <h2 style={{ fontWeight: 700, marginBottom: 12, color: '#04143a' }}>Order summary</h2>
        {lines.map((l) => (
          <div className="co__line" key={l.id}>
            <span>{l.name} × {l.qty}</span>
            <span>{formatPence(l.pricePence * l.qty)}</span>
          </div>
        ))}
        <div className="co__total">
          <span>Total</span>
          <span>{formatPence(subtotalPence)}</span>
        </div>
      </div>
    </div>
  );
}
