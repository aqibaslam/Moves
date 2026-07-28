import { mediaUrl, mediaAlt } from '@/lib/media';

export interface TeamData {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  subtext?: string;
  button?: { label?: string; href?: string };
  members?: { name?: string; role?: string; gdc?: string; photo?: unknown }[];
}

interface Member {
  name: string;
  role: string;
  gdc: string;
  photo: string;
  photoAlt: string;
}

export function Team({ data }: { data?: TeamData }) {
  const members: Member[] = data?.members?.length
    ? data.members.map((m) => ({
        name: m.name ?? '',
        role: m.role ?? '',
        gdc: m.gdc ?? '',
        photo: mediaUrl(m.photo, '/images/team-photo.png'),
        photoAlt: mediaAlt(m.photo, m.name ?? ''),
      }))
    : Array.from({ length: 4 }).map(() => ({
        name: 'Dr. Amir Hussain',
        role: 'Moves Verified Dentist',
        gdc: 'GDC No. 12345',
        photo: '/images/team-photo.png',
        photoAlt: 'Dr. Amir Hussain',
      }));

  return (
    <section className="card-section team" id="team">
      <div className="team__head">
        <div className="team__head-l">
          <p className="eyebrow">{data?.eyebrow ?? 'OUR TEAM'}</p>
          <h2 className="h-section">
            <span className="c">{data?.heading?.accent ?? 'The names'}</span>{' '}
            {data?.heading?.rest ?? 'behind the smiles.'}
          </h2>
          <p className="lead">
            {data?.subtext ??
              'Every MOVES plan is signed by one of these dentists. Every one of them is on the GDC register, check for yourself.'}
          </p>
        </div>
        <a className="btn btn--navy btn--w250" href={data?.button?.href ?? '#cta'}>
          {data?.button?.label ?? 'Book Free Consultation'}
        </a>
      </div>

      <div className="team__cards">
        {members.map((m, i) => (
          <article className="tcard" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tcard__photo" src={m.photo} alt={m.photoAlt} />
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
                <p className="tcard__name">{m.name}</p>
                <div className="tcard__sub">
                  <span>{m.role}</span>
                  <span>{m.gdc}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
