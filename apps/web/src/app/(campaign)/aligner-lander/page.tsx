import type { Route } from 'next';
import { permanentRedirect } from 'next/navigation';

/** The Black Friday page lives at /bf-sale-pdp. Keep the earlier URL working. */
export default function AlignerLanderRedirect() {
  permanentRedirect('/bf-sale-pdp' as Route);
}
