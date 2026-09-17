import { BOOKING_PATH } from '@/lib/booking/links';

/* Signed hero (Figma 984:18363) — reuses the clear-aligners navy hero card
   (`.ca-hero`, scoped to `.ca26`): an eyebrow, headline (coral "is signed."),
   lead, coral CTA + text link, and a portrait on the soft blue glow on the right.
   ("There is a real person behind every plan." lives in the SignedPerson section
   below, so the hero keeps its own headline to avoid repeating it.) */
export function SignedHero() {
  return (
    <section className="ca-hero sg-hero">
      <div className="ca-hero__inner">
        <div className="ca-hero__col">
          <h1 className="ca-hero__title">
            Every moves smile <span className="ca-hero__accent">is signed.</span>
          </h1>
          <p className="ca-hero__lead">
            A moves smile isn&rsquo;t just a treatment. It&rsquo;s a promise made by a real dentist who
            has assessed you, signed your plan and takes ownership of your care.
          </p>

          <div className="ca-hero__actions">
            <a className="btn lp26-btn ca-hero__cta" href={BOOKING_PATH}>
              Book Free Consultation
            </a>
            <a className="ca-hero__link" href="#pricing">
              See exactly what it costs
            </a>
          </div>
        </div>

        <div className="ca-hero__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ca-hero__portrait"
            src="/images/signed-hero-portrait.png"
            alt="A person holding a clear aligner"
          />
          {/* handwritten "Signed" mark stamped over the portrait (Figma 984:18503) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="sg-hero__mark"
            src="/images/signed-mark.svg"
            alt=""
            aria-hidden="true"
            width={247}
            height={234}
          />
        </div>
      </div>
    </section>
  );
}
