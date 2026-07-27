import { StarChip, TrustpilotStar } from './icons';

const NAV = ['Your Move', 'Signed', 'Pricing', 'In motion', 'The movers'];

export function Hero() {
  return (
    <div className="hero-unit">
      <div className="announce">
        <span className="announce__note">
          Every MOVES® smile is signed by a named, GDC-registered dentist.
        </span>
        <a className="announce__link" href="#team">
          Meet the dentists who sign →
        </a>
      </div>

      <nav className="nav" aria-label="Primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="nav__logo" src="/images/moves-logo.svg" alt="Moves" width={163} height={20} />
        <div className="nav__links">
          {NAV.map((l) => (
            <a key={l} href="#">
              {l}
            </a>
          ))}
        </div>
        <a className="btn btn--outline" href="#cta">
          Book A Consultation
        </a>
      </nav>

      <section className="hero" id="main">
        <div className="hero__left">
          <div className="hero__intro">
            <div className="rating">
              <div className="rating__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarChip key={i} />
                ))}
              </div>
              <div className="rating__tp">
                <TrustpilotStar />
                <span>Trustpilot</span>
              </div>
              <span className="rating__count">Excellent (3,890)</span>
            </div>

            <h1 className="h-hero">
              <span className="c">The smile</span> you&rsquo;ve been putting off
            </h1>

            <p className="hero__sub">
              MOVES is the movement behind modern smiles. Planned in person, signed by a named
              GDC-registered dentist, at a price we publish. The smile is yours, the signature means
              you never move alone.
            </p>
          </div>

          <div className="hero__cta">
            <a className="btn btn--navy btn--w250" href="#cta">
              Book Free Consultation
            </a>
            <a className="hero__link" href="#pricing">
              <span>See exactly what it costs</span>
              <i />
            </a>
          </div>

          <div className="sigcard">
            <span className="sigcard__name">Amelia Hart</span>
            <span className="sigcard__div" />
            <div className="sigcard__meta">
              <span className="muted">SIGNED · GDC No. 123456</span>
              <span className="strong">ON THE PLAN. IN YOUR ACCOUNT. ON THE BOX.</span>
            </div>
          </div>
        </div>

        <div className="hero__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-portrait.png" alt="A person smiling confidently" />
        </div>
      </section>
    </div>
  );
}
