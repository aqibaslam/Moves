import { permanentRedirect } from 'next/navigation';

/** The standard landing page now lives at /aligner-lander. Keep the old URL working. */
export default function LandingPageRedirect() {
  permanentRedirect('/aligner-lander');
}
