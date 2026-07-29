import { StarChip, TrustpilotStar } from './icons';

export interface ReviewsData {
  eyebrow?: string;
  ratingCount?: string;
  heading?: { accent?: string; rest?: string };
  viewMoreLabel?: string;
  reviews?: { author?: string; timeAgo?: string; title?: string; body?: string }[];
}

interface Review {
  meta: string;
  ago: string;
  title: string;
  body: string;
}

const REVIEW: Review = {
  meta: 'Pauline,',
  ago: '5 hours ago',
  title: 'Moves is genius',
  body: 'With Capable, I’ve expanded my network and found genuine connections. The seamless interface makes socializing so much easier.',
};

function ReviewCard({ review }: { review: Review }) {
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
        {review.meta} <span className="reg">{review.ago}</span>
      </p>
      <h3 className="rcard__title">{review.title}</h3>
      <p className="rcard__body">{review.body}</p>
    </article>
  );
}

export function Reviews({ data }: { data?: ReviewsData }) {
  const reviews: Review[] = data?.reviews?.length
    ? data.reviews.map((r) => ({
        meta: r.author ? `${r.author},` : '',
        ago: r.timeAgo ?? '',
        title: r.title ?? '',
        body: r.body ?? '',
      }))
    : Array.from({ length: 12 }).map(() => REVIEW);

  const columns: Review[][] = [[], [], []];
  reviews.forEach((r, i) => columns[i % 3].push(r));

  return (
    <section className="card-section reviews">
      <div className="reviews__head">
        {data?.eyebrow ? <p className="eyebrow">{data.eyebrow}</p> : null}
        <div className="reviews__tp">
          <span className="rating__count">{data?.ratingCount ?? 'Excellent (3,890)'}</span>
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
          <span className="c">{data?.heading?.accent ?? 'Don’t take'}</span>{' '}
          {data?.heading?.rest ?? 'our word for it'}
        </h2>
      </div>

      <div className="reviews__grid">
        {columns.map((col, ci) => (
          <div className="reviews__col" key={ci}>
            {col.map((r, ri) => (
              <ReviewCard key={ri} review={r} />
            ))}
          </div>
        ))}
      </div>

      <a className="btn btn--outline" href="#">
        {data?.viewMoreLabel ?? 'View more'}
      </a>
    </section>
  );
}
