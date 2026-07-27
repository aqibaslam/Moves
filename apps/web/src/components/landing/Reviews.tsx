import { StarChip, TrustpilotStar } from './icons';

const REVIEW = {
  meta: 'Pauline,',
  ago: '5 hours ago',
  title: 'Moves is genius',
  body: 'With Capable, I’ve expanded my network and found genuine connections. The seamless interface makes socializing so much easier.',
};

function ReviewCard() {
  return (
    <article className="rcard">
      <div className="rcard__top">
        <div className="rcard__stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarChip key={i} size={12.6} pad={2.6} />
          ))}
        </div>
        <span className="rcard__verified">Verified</span>
      </div>
      <p className="rcard__meta">
        {REVIEW.meta} <span className="reg">{REVIEW.ago}</span>
      </p>
      <h3 className="rcard__title">{REVIEW.title}</h3>
      <p className="rcard__body">{REVIEW.body}</p>
    </article>
  );
}

export function Reviews() {
  return (
    <section className="card-section reviews">
      <div className="reviews__head">
        <div className="reviews__tp">
          <span className="rating__count">Excellent (3,890)</span>
          <div className="rating__stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarChip key={i} />
            ))}
          </div>
          <div className="rating__tp">
            <TrustpilotStar />
            <span>Trustpilot</span>
          </div>
        </div>
        <h2 className="reviews__title">
          <span className="c">Don&rsquo;t take</span> our word for it
        </h2>
      </div>

      <div className="reviews__grid">
        {Array.from({ length: 3 }).map((_, col) => (
          <div className="reviews__col" key={col}>
            {Array.from({ length: 4 }).map((__, row) => (
              <ReviewCard key={row} />
            ))}
          </div>
        ))}
      </div>

      <a className="btn btn--outline" href="#">
        View more
      </a>
    </section>
  );
}
