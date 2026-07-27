export function Team() {
  return (
    <section className="card-section team" id="team">
      <div className="team__head">
        <div className="team__head-l">
          <p className="eyebrow">OUR TEAM</p>
          <h2 className="h-section">
            <span className="c">The names</span> behind the smiles.
          </h2>
          <p className="lead">
            Every MOVES plan is signed by one of these dentists. Every one of them is on the GDC
            register, check for yourself.
          </p>
        </div>
        <a className="btn btn--navy btn--w250" href="#cta">
          Book Free Consultation
        </a>
      </div>

      <div className="team__cards">
        {Array.from({ length: 4 }).map((_, i) => (
          <article className="tcard" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tcard__photo" src="/images/team-photo.png" alt="Dr. Amir Hussain" />
            <div className="tcard__right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="tcard__mark"
                src="/images/team-icon.svg"
                alt=""
                aria-hidden="true"
                width={22}
                height={20}
              />
              <div className="tcard__info">
                <p className="tcard__name">Dr. Amir Hussain</p>
                <div className="tcard__sub">
                  <span>Moves Verified Dentist</span>
                  <span>GDC No. 12345</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
