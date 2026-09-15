import { BOOKING_PATH } from '@/lib/booking/links';

/* "Every moves package includes more than aligners" (Figma 984:11424) — dark
   navy section: heading + lead + coral CTA + a 2-column checklist on the left,
   full-bleed portrait on the right. */

const ITEMS = [
  'In-person dentist appointments',
  'Signed treatment plan',
  'Every aligner in your plan',
  'Mid-course corrections if clinically needed',
  'Transparent pricing before treatment begins',
  'Digital preview of your movement',
  '3D scan and assessment',
  'Moves care plan check-ins',
  'Retainers included',
];

function Tick() {
  return (
    <svg className="ph-incl__tick" viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
      <path d="m4 10.5 4 4 8-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PackageIncludes() {
  return (
    <section className="ph-incl">
      <div className="ph-incl__inner">
        <div className="ph-incl__col">
          <h2 className="ph-incl__title">
            Every moves package includes more <span className="ink-red">than aligners</span>
          </h2>
          <p className="ph-incl__lead">
            Your package includes the treatment essentials, from your scan and signed plan to
            progress checks and final support.
          </p>
          <a className="btn lp26-btn ph-incl__cta" href={BOOKING_PATH}>
            Book Free Consultation
          </a>

          <ul className="ph-incl__list">
            {ITEMS.map((t) => (
              <li className="ph-incl__item" key={t}>
                <Tick />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="ph-incl__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ph-incl__photo" src="/images/pricing-care-portrait.png" alt="A person holding a clear aligner" />
        </div>
      </div>
    </section>
  );
}
