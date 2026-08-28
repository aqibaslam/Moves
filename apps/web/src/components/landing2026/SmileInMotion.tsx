import { BOOKING_PATH } from '@/lib/booking/links';

/* "Your smile. In motion." (Figma node 413:10162). Full-bleed portrait with a
   centred heading, a label + CTA pill, and a supporting line beneath. */
export function SmileInMotion() {
  return (
    <section className="lp26-motion">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp26-motion__photo" src="/images/lp26-motion.png" alt="A person smiling" />
      <div className="lp26-motion__inner">
        <h2 className="lp26-motion__title">
          Your smile. In <span className="ink-red">motion.</span>
        </h2>
        <div className="lp26-motion__pill">
          <span className="lp26-motion__label">Clear Aligners</span>
          <a className="btn lp26-btn" href={BOOKING_PATH}>
            Book Free Consultation
          </a>
        </div>
        <p className="lp26-motion__quote">
          I stopped thinking about hiding my teeth and started looking forward to showing my smile
        </p>
      </div>
    </section>
  );
}
