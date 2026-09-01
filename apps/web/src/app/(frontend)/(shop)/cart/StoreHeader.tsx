'use client';

import Link from 'next/link';
import { useCart } from './CartContext';
import { ShopMark } from './ShopMark';

export function StoreHeader() {
  const { count, setOpen } = useCart();
  return (
    <header className="sh">
      <div className="sh__inner">
        <Link href="/shop" className="sh__brand" aria-label="Moves shop">
          <ShopMark className="sh__mark" />
          <span className="sh__word">MOVES</span>
        </Link>

        <nav className="sh__nav" aria-label="Shop">
          <Link href="/shop" className="sh__navlink">Shop</Link>
          <Link href="/book" className="sh__navlink">Book a consultation</Link>
        </nav>

        <button
          className="sh__cart"
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 4h2l2.4 12.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6" />
            <circle cx="10" cy="21" r="1" />
            <circle cx="18" cy="21" r="1" />
          </svg>
          {count > 0 ? <span className="sh__count">{count}</span> : null}
        </button>
      </div>
    </header>
  );
}
