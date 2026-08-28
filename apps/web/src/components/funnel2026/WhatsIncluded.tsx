import { BOOKING_PATH } from '@/lib/booking/links';

/* "What's included" (Figma funnel 2026) — heading + product-kit image, then a
   4×2 grid of feature cards, then a CTA. New-branding colours come from the
   .funnel-2026 scope. */

const FEATURES = [
  { title: 'Moves Aligners', body: 'Custom clear aligners designed to gently move teeth into their ideal position.' },
  { title: 'Moves Whitening', body: 'Custom clear aligners designed to gently move teeth into their ideal position.' },
  { title: 'Moves Retainers', body: 'Custom clear aligners designed to gently move teeth into their ideal position.' },
  { title: 'Moves App/Tracking', body: 'Custom clear aligners designed to gently move teeth into their ideal position.' },
  { title: 'Dentist appointments', body: 'Custom clear aligners designed to gently move teeth into their ideal position.' },
  { title: 'Smile finishing', body: 'Custom clear aligners designed to gently move teeth into their ideal position.' },
  { title: 'Moves Guarantee', body: 'Custom clear aligners designed to gently move teeth into their ideal position.' },
  { title: 'aftercare', body: 'Custom clear aligners designed to gently move teeth into their ideal position.' },
];

function DotIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="11" cy="11" r="2.4" fill="currentColor" />
    </svg>
  );
}

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
      <img className="f26-incl__product" src="/images/funnel2026-kit.png" alt="The MOVES kit" />

      <div className="f26-incl__grid">
        {FEATURES.map((f) => (
          <article className="f26-incl__card" key={f.title}>
            <span className="f26-incl__icon" aria-hidden="true">
              <DotIcon />
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
