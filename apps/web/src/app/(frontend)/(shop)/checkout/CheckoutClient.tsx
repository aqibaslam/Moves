'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { formatPence, useCart } from '../cart/CartContext';
import { placeOrderUnpaid, type ShippingInput } from './actions';
import { StripePayment } from './StripePayment';

const EMPTY: ShippingInput = {
  firstName: '', lastName: '', email: '', address: '', apartment: '', city: '', postcode: '', phone: '', country: 'United Kingdom',
};

export function CheckoutClient({ stripeEnabled, publishableKey }: { stripeEnabled: boolean; publishableKey: string }) {
  const { lines, subtotalPence, clear } = useCart();
  const [s, setS] = useState<ShippingInput>(EMPTY);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof ShippingInput) => (e: React.ChangeEvent<HTMLInputElement>) => setS((p) => ({ ...p, [k]: e.target.value }));
  const cartLines = lines.map((l) => ({ id: l.id, qty: l.qty }));

  const validate = useCallback((): string | undefined => {
    if (!s.firstName.trim() || !s.lastName.trim()) return 'Enter your first and last name.';
    if (!s.email.trim()) return 'Enter your email.';
    if (!s.address.trim()) return 'Enter your address.';
    if (!s.city.trim()) return 'Enter your city.';
    if (!s.postcode.trim()) return 'Enter your postcode.';
    if (!s.phone.trim()) return 'Enter your phone number.';
    return undefined;
  }, [s]);

  const getShipping = useCallback(() => ({ shipping: s, error: validate() }), [s, validate]);

  async function placeUnpaid() {
    const err = validate();
    if (err) { setError(err); return; }
    setBusy(true); setError(null);
    const res = await placeOrderUnpaid(s, cartLines);
    setBusy(false);
    if (res.ok) { clear(); setDone(res.reference); } else setError(res.error);
  }

  if (done) {
    return (
      <div className="co__done">
        <h1>Order placed 🎉</h1>
        <p>Thanks — your reference: <strong>{done}</strong>. A confirmation is on its way to {s.email}.</p>
        <p style={{ marginTop: 16 }}><Link href="/shop" className="cd__continue">Continue shopping</Link></p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="co__empty">
        <p>Your cart is empty.</p>
        <p style={{ marginTop: 12 }}><Link href="/shop" className="cd__continue">Browse the shop</Link></p>
      </div>
    );
  }

  return (
    <div className="co2">
      {/* left — details + payment */}
      <div className="co2__main">
        <section className="co2__card">
          <h2 className="co2__step"><span>1</span> Shipping Details</h2>
          <div className="co2__row2">
            <Field label="First Name" required value={s.firstName} onChange={set('firstName')} />
            <Field label="Last Name" required value={s.lastName} onChange={set('lastName')} />
          </div>
          <Field label="Email" required type="email" placeholder="info@gmail.com" value={s.email} onChange={set('email')} />
          <Field label="Address" required placeholder="Start typing your address…" value={s.address} onChange={set('address')} />
          <Field label="Apartment, suite, etc. (optional)" value={s.apartment ?? ''} onChange={set('apartment')} />
          <div className="co2__row2">
            <Field label="City" required placeholder="London" value={s.city} onChange={set('city')} />
            <Field label="Postcode" required placeholder="e.g. SW1A 1AA" value={s.postcode} onChange={set('postcode')} />
          </div>
          <Field label="Phone" required placeholder="+44 7700 900000" value={s.phone} onChange={set('phone')} />
        </section>

        <section className="co2__card">
          <h2 className="co2__step"><span>2</span> Payment</h2>
          {error ? <p className="co__error">{error}</p> : null}
          {stripeEnabled ? (
            <StripePayment
              publishableKey={publishableKey}
              lines={cartLines}
              total={subtotalPence}
              getShipping={getShipping}
              onDone={(ref) => { clear(); setDone(ref); }}
            />
          ) : (
            <div className="co__pay">
              <p className="co__notice">
                Card payment isn’t switched on yet. You can place the order now and we’ll take
                payment separately.
              </p>
              <button className="co__paybtn" type="button" onClick={placeUnpaid} disabled={busy}>
                {busy ? 'Placing…' : `Place order · ${formatPence(subtotalPence)}`}
              </button>
              <div className="co__secure">🔒 Secure checkout</div>
            </div>
          )}
        </section>
      </div>

      {/* right — order summary */}
      <aside className="co2__summary">
        <h2 className="co2__sumtitle">Order Summary</h2>
        {lines.map((l) => (
          <div className="co2__line" key={l.id}>
            <div className="co2__lthumb">
              {l.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.image} alt={l.name} />
              ) : (
                <span aria-hidden="true">🦷</span>
              )}
            </div>
            <div className="co2__lmeta">
              <p className="co2__lname">{l.name}</p>
              <p className="co2__lqty">Qty {l.qty}</p>
            </div>
            <span className="co2__lprice">{formatPence(l.pricePence * l.qty)}</span>
          </div>
        ))}
        <div className="co2__srow"><span>Subtotal</span><span>{formatPence(subtotalPence)}</span></div>
        <div className="co2__srow"><span>Shipping</span><span className="co2__free">Free</span></div>
        <div className="co2__total"><span>Today’s total</span><strong>{formatPence(subtotalPence)}</strong></div>
      </aside>
    </div>
  );
}

function Field({
  label, required, value, onChange, placeholder, type = 'text',
}: {
  label: string; required?: boolean; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string;
}) {
  return (
    <label className="co2__field">
      <span className="co2__label">{label}{required ? <b> *</b> : null}</span>
      <input className="co2__input" type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  );
}
