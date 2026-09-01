import { BOOKING_PATH } from '@/lib/booking/links';

/* "What's included" (Figma funnel 2026) — heading + product-kit image, then a
   4×2 grid of feature cards, then a CTA. New-branding colours come from the
   .funnel-2026 scope. */

const BODY = 'Custom clear aligners designed to gently move teeth into their ideal position.';

/* Icons extracted from the Figma "What's included" cards (white glyphs on the
   navy badge). */
const FEATURES = [
  { title: 'Moves Aligners', body: BODY, icon: '/images/f26-incl-aligners.svg' },
  { title: 'Moves Whitening', body: BODY, icon: '/images/f26-incl-whitening.svg' },
  { title: 'Moves Retainers', body: BODY, icon: '/images/f26-incl-retainers.svg' },
  { title: 'Moves App/Tracking', body: BODY, icon: '/images/f26-incl-app.svg' },
  { title: 'Dentist appointments', body: BODY, icon: '/images/f26-incl-dentist.svg' },
  { title: 'Smile finishing', body: BODY, icon: '/images/f26-incl-finishing.svg' },
  { title: 'Moves Guarantee', body: BODY, icon: '/images/f26-incl-guarantee.svg' },
  { title: 'aftercare', body: BODY, icon: '/images/f26-incl-aftercare.svg' },
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
      <img className="f26-incl__product" src="/images/funnel2026-kit.webp" alt="The MOVES kit" />

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
