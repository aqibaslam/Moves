import { BOOKING_PATH } from '@/lib/booking/links';

/* "What's included" (Figma node 1745:6888) — heading + product-kit image, then
   three feature cards, then a CTA. New-branding colours come from the
   .funnel-2026 scope. */

/* Icons extracted from the Figma "What's included" cards (white glyphs on the
   navy badge). */
const FEATURES = [
  {
    title: 'Custom Aligner Case',
    body: 'Your personalised aligners stored safely in a premium MOVES case.',
    icon: '/images/funnel2026-incl-case.svg',
  },
  {
    title: 'Care Accessories Kit',
    body: 'Chewies, aligner file and IPR strips included for a smoother treatment experience.',
    icon: '/images/funnel2026-incl-kit-icon.svg',
  },
  {
    title: 'Patient Guide',
    body: 'A complete instruction sheet to help you confidently start your smile journey.',
    icon: '/images/funnel2026-incl-guide.svg',
  },
];

export function WhatsIncluded() {
  return (
    <section className="card-section f26-incl">
      <div className="f26-incl__head">
        <h2 className="f26-incl__title">
          What&rsquo;s <span className="c">included</span>
        </h2>
        <p className="f26-incl__sub">
          Everything you need to start, track, and maintain your clear aligner journey with
          dentist-led care, advanced scans, and support at every step.
        </p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="f26-incl__product" src="/images/funnel2026-incl-kit.svg" alt="The MOVES kit" />

      <div className="f26-incl__grid">
        {FEATURES.map((f) => (
          <article className="f26-incl__card" key={f.title}>
            <span className="f26-incl__icon" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="f26-incl__glyph" src={f.icon} alt="" />
            </span>
            <h3 className="f26-incl__ctitle">{f.title}</h3>
            <p className="f26-incl__cbody">{f.body}</p>
          </article>
        ))}
      </div>

      <a className="btn f26-incl__cta" href={BOOKING_PATH}>
        Book Free Consultation
      </a>
    </section>
  );
}
