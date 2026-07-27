const TIERS = [
  {
    icon: 'icon-target',
    title: 'Mover',
    body: 'You make the first move: scan day, your own code, your smile in motion.',
  },
  {
    icon: 'icon-megaphone',
    title: 'Advocate',
    body: 'A friend moves on your code. You both get rewarded, every time.',
  },
  {
    icon: 'icon-folder-edit',
    title: 'Creator',
    body: 'Your story becomes the brand: shoots, features, your move on our channels.',
  },
  {
    icon: 'icon-shield-half',
    title: 'Insider',
    body: 'First look at everything next. New products, new cities, before anyone.',
  },
];

export function Movers() {
  return (
    <section className="card-section movers">
      <div className="movers__head">
        <div className="movers__head-l">
          <p className="eyebrow">THE MOVERS</p>
          <h2 className="h-section">
            <span className="c">You don&rsquo;t buy moves.</span> You join it.
          </h2>
          <p className="lead">
            Every patient becomes a Mover on scan day: a code of your own, rewards when a friend
            makes their move, first look at whatever we do next. The best Movers end up making the
            brand with us.
          </p>
        </div>
        <a className="btn btn--navy btn--w250" href="#cta">
          Book Free Consultation
        </a>
      </div>

      <div className="movers__tiers">
        {TIERS.map((t) => (
          <div className="tier" key={t.title}>
            <span className="tier__icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/${t.icon}.svg`} alt="" aria-hidden="true" width={24} height={24} />
            </span>
            <h3 className="tier__title">{t.title}</h3>
            <p className="tier__body">{t.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
