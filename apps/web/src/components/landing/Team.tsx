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
        {Array.from({ length: 5 }).map((_, i) => (
          <article className="tcard" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tcard__photo" src="/images/team-photo.png" alt="Dr. Amir Hussain" />
            <div className="tcard__info">
              <div>
                <h3 className="tcard__name">Dr. Amir Hussain</h3>
                <p className="tcard__sub">Moves Verified Dentist</p>
                <p className="tcard__sub">GDC No. 12345</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
