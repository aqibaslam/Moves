/* Storefront shell: provides the cart, the header cart icon, and the drawer.
   Nested inside (frontend), so it inherits the site's <html>/<body> + fonts. */
import { CartDrawer } from './cart/CartDrawer';
import { CartProvider } from './cart/CartContext';
import { StoreHeader } from './cart/StoreHeader';
import './storefront.css';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <StoreHeader />
      <main className="shop">{children}</main>
      <CartDrawer />
    </CartProvider>
  );
}
