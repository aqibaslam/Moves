import { mediaUrl, mediaAlt } from '@/lib/media';

export interface HowItWorksData {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  subtext?: string;
  button?: { label?: string; href?: string };
  steps?: {
    stepLabel?: string;
    title?: string;
    body?: string;
    image?: unknown;
    imageOverlay?: unknown;
  }[];
}

const STEPS = [
  {
    num: 'STEP 01',
    title: 'Scan day',
    body: 'Twenty minutes, in person, with a dentist. A 3D scan — and if aligners won’t work for you, we say so, and you pay nothing.',
  },
  {
    num: 'STEP 02',
    title: 'The signed plan',
    body: 'Every stage of the move, on screen, before you pay a pound. Signed by name, with a GDC number you can look up in eight seconds.',
  },
  {
    num: 'STEP 03',
    title: 'In motion',
    body: 'Aligners made in Germany, finished by hand, delivered to your door. Check-ins reach you before you have to ask, stage by stage.',
  },
];

export function HowItWorks({ data }: { data?: HowItWorksData }) {
  const steps = data?.steps?.length
    ? data.steps.map((s) => ({
        num: s.stepLabel ?? '',
        title: s.title ?? '',
        body: s.body ?? '',
        image: mediaUrl(s.image, ''),
        imageAlt: mediaAlt(s.image, s.title ?? ''),
        overlay: s.imageOverlay ? mediaUrl(s.imageOverlay, '') : null,
      }))
    : STEPS.map((s, i) => ({
        num: s.num,
        title: s.title,
        body: s.body,
        image: `/images/step${i + 1}${i === 0 ? '-a' : ''}.png`,
        imageAlt: s.title,
        overlay: i === 0 ? '/images/step1-b.png' : null,
      }));

  return (
    <section className="card-section how">
      <div className="how__head">
        <div className="how__head-l">
          <p className="eyebrow">{data?.eyebrow ?? 'HOW IT WORKS'}</p>
          <h2 className="h-section">
            <span className="c">{data?.heading?.accent ?? 'You move,'}</span>{' '}
            {data?.heading?.rest ?? 'in Three moves'}
          </h2>
          <p className="lead">
            {data?.subtext ??
              'No postal impression kits. No anonymous review team. A dentist, a scanner, a signature then motion.'}
          </p>
        </div>
        <a
          className="btn btn--navy btn--w250 how__cta how__cta--head"
          href={data?.button?.href ?? '#cta'}
        >
          {data?.button?.label ?? 'Book Free Consultation'}
        </a>
      </div>

      <div className="how__steps">
        {steps.map((s, i) => (
          <div className="step" key={i}>
            <div className="step__top">
              <span className="step__num">{s.num}</span>
              <h3 className="step__title">{s.title}</h3>
            </div>
            <div className={`step__media${s.overlay ? ' step__media--stack' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt={s.imageAlt} />
              {s.overlay && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.overlay}
                  alt=""
                  aria-hidden="true"
                  style={{ left: '58%', top: 0, height: '70%' }}
                />
              )}
            </div>
            <p className="step__body">{s.body}</p>
          </div>
        ))}
      </div>

      {/* mobile-only CTA: Figma places it beneath the step cards */}
      <a
        className="btn btn--navy how__cta how__cta--foot"
        href={data?.button?.href ?? '#cta'}
      >
        {data?.button?.label ?? 'Book Free Consultation'}
      </a>
    </section>
  );
}
