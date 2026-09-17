/* How it works hero (Figma 984:10312) — navy stage with a centred headline
   ("How it work", coral "work"), a lead line, a soft blue glow, and a full-width
   row of tilted patient photos banner along the bottom. */
export function HiwHero() {
  return (
    <section className="hiw-hero">
      <div className="hiw-hero__stage">
        <h1 className="hiw-hero__title">
          How it <span className="hiw-hero__accent">work</span>
        </h1>
        <p className="hiw-hero__lead">
          From your first smile assessment to your final results, we make every step simple,
          comfortable, and tailored to you.
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hiw-hero__banner" src="/images/hiw-hero-banner.png" alt="" aria-hidden="true" />
    </section>
  );
}
