import type { Route } from 'next';
import { permanentRedirect } from 'next/navigation';

/** The Black Friday page now lives at /bf-sale-pdp. Keep the old URL working. */
export default function BlackFridayRedirect() {
  permanentRedirect('/bf-sale-pdp' as Route);
}
