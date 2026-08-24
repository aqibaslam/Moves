'use client';

import Link from 'next/link';
import { formatPence, useCart } from './CartContext';

export function CartDrawer() {
  const { lines, subtotalPence, open, setOpen, setQty, remove } = useCart();

  return (
    <>
      <div
        className={`cd__scrim ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside className={`cd ${open ? 'is-open' : ''}`} aria-label="Shopping cart" aria-hidden={!open}>
        <div className="cd__head">
          <h2 className="cd__title">Your cart</h2>
          <button className="cd__close" type="button" onClick={() => setOpen(false)} aria-label="Close cart">×</button>
        </div>

        {lines.length === 0 ? (
          <p className="cd__empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cd__list">
              {lines.map((l) => (
                <li className="cd__item" key={l.id}>
                  <div className="cd__thumb">
                    {l.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.image} alt={l.name} />
                    ) : (
                      <span aria-hidden="true">🦷</span>
                    )}
                  </div>
                  <div className="cd__meta">
                    <p className="cd__name">{l.name}</p>
                    <p className="cd__price">{formatPence(l.pricePence)}</p>
                    <div className="cd__qty">
                      <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease quantity">−</button>
                      <span>{l.qty}</span>
                      <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <button className="cd__remove" type="button" onClick={() => remove(l.id)} aria-label={`Remove ${l.name}`}>Remove</button>
                </li>
              ))}
            </ul>

            <div className="cd__foot">
              <div className="cd__subtotal">
                <span>Subtotal</span>
                <strong>{formatPence(subtotalPence)}</strong>
              </div>
              <Link href="/checkout" className="cd__checkout" onClick={() => setOpen(false)}>
                Checkout
              </Link>
              <button className="cd__continue" type="button" onClick={() => setOpen(false)}>Continue shopping</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
