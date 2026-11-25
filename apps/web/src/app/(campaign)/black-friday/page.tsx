import { permanentRedirect } from 'next/navigation';

/** The Black Friday page now lives at /aligner-lander. Keep the old URL working. */
export default function BlackFridayRedirect() {
  permanentRedirect('/aligner-lander');
}
