/* About Us hero (Figma 541:1589) — dark band with a centred "About us" heading,
   supporting line, and a portrait on a blue dome. */
export function AboutHero() {
  return (
    <section className="about-hero">
      <div className="about-hero__inner">
        <h1 className="about-hero__title">
          About <span className="ink-red">us</span>
        </h1>
        <p className="about-hero__lead">
          We help business, unlock their full potential through strategy, innovation, and results
        </p>
      </div>
      <div className="about-hero__media">
        {/* dome: a wide CSS arch with a dark navy gradient (behind the portrait) */}
        <div className="about-hero__dome" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="about-hero__photo" src="/images/about-hero-lady.png" alt="A person holding a clear aligner" />
      </div>
    </section>
  );
}
