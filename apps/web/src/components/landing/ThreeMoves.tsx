/* 2.0 "You move, in three moves" (Figma node 32:1252) — left intro column
   (heading + copy + CTA) and a right numbered list of three icon steps. */
import { bookingHref } from '@/lib/booking/links';

const STEPS = [
  {
    num: 'STEP 01',
    title: 'Scan day',
    body: 'Twenty minutes, in person, with a dentist. A 3D scan — and if aligners won’t work for you, we say so, and you pay nothing.',
    icon: '/images/step-1.svg',
  },
  {
    num: 'STEP 02',
    title: 'The signed plan',
    body: 'Every stage of the move, on screen, before you pay a pound. Signed by name, with a GDC number you can look up in eight seconds.',
    icon: '/images/step-2.svg',
  },
  {
    num: 'STEP 03',
    title: 'In motion',
    body: 'Aligners made in Germany, finished by hand, delivered to your door. Check-ins reach you before you have to ask, stage by stage.',
    icon: '/images/step-3.svg',
  },
];

export interface ThreeMovesData {
  heading?: { accent?: string; rest?: string };
  subtext?: string;
  button?: { label?: string; href?: string };
}

export function ThreeMoves({ data }: { data?: ThreeMovesData }) {
  return (
    <section className="card-section moves3">
      <div className="moves3__intro">
        <h2 className="moves3__title">
          <span className="c">{data?.heading?.accent ?? 'You move,'}</span>{' '}
          {data?.heading?.rest ?? 'in three moves'}
        </h2>
        <p className="moves3__sub">
          {data?.subtext ??
            'No postal impression kits. No anonymous review team. A dentist, a scanner, a signature then motion.'}
        </p>
        <a className="btn btn--coral moves3__cta" href={bookingHref(data?.button?.href)}>
          {data?.button?.label ?? 'Book Free Consultation'}
        </a>
      </div>

      <ol className="moves3__list">
        {STEPS.map((s) => (
          <li className="moves3__step" key={s.num}>
            <span className="moves3__icon" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.icon} alt="" />
            </span>
            <div className="moves3__step-body">
              <span className="moves3__step-num">{s.num}</span>
              <h3 className="moves3__step-title">{s.title}</h3>
              <p className="moves3__step-text">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
