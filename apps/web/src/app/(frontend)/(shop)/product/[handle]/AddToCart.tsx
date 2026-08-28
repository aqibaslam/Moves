'use client';

import { useState } from 'react';
import { useCart, type CartLine } from '../../cart/CartContext';

export function AddToCart({ product }: { product: Omit<CartLine, 'qty'> }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <>
      <button
        className="pp__add"
        type="button"
        onClick={() => {
          add(product, 1);
          setAdded(true);
        }}
      >
        Add to cart
      </button>
      {added ? <p className="pp__added">Added to your cart ✓</p> : null}
    </>
  );
}
