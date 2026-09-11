/* Contact hero (Figma 533:476) — dark navy stage with a hand holding a phone on
   the left, a hand holding an aligner on the right, and the centred headline. */
export function ContactHero() {
  return (
    <section className="contact-hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="contact-hero__hand contact-hero__hand--l" src="/images/contact-phone-hand.png" alt="" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="contact-hero__hand contact-hero__hand--r" src="/images/contact-aligner-hand.png" alt="" aria-hidden="true" />

      <div className="contact-hero__center">
        <h1 className="contact-hero__title">
          Let&rsquo;s talk
          <br />
          about <span className="ink-red">your
          <br />
          smile</span>
        </h1>
        <p className="contact-hero__sub">
          Fill out the form below, and our team will guide you on your next steps
        </p>
      </div>
    </section>
  );
}
