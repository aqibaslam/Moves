'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

function Card({ m }: { m: Member }) {
  return (
    <article className="tcard">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tcard__photo" src={m.photo} alt={m.photoAlt} draggable={false} />
      <div className="tcard__right">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="tcard__mark"
          src="/images/team-icon.svg"
          alt=""
          aria-hidden="true"
          width={22}
          height={20}
          draggable={false}
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
  );
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

  const dots = Math.max(members.length, 1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  // Desktop is a CSS marquee (overflow hidden). Mobile is a real slider:
  // the viewport scrolls and these keep the bullet dots in sync.
  const syncActive = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    setActive(Math.round(ratio * (dots - 1)));
  }, [dots]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncActive, { passive: true });
    window.addEventListener('resize', syncActive);
    syncActive();
    return () => {
      el.removeEventListener('scroll', syncActive);
      window.removeEventListener('resize', syncActive);
    };
  }, [syncActive]);

  const goToDot = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (i / Math.max(dots - 1, 1)) * max, behavior: 'smooth' });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
    el.classList.add('dragging');
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = () => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current.down = false;
    el.classList.remove('dragging');
  };

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
        <a className="btn btn--navy btn--w250 team__cta" href={data?.button?.href ?? '#cta'}>
          {data?.button?.label ?? 'Book Free Consultation'}
        </a>
      </div>

      {/* desktop: auto-looping marquee (two identical groups, -50% translate).
          mobile: the 2nd group is hidden and this becomes a drag/scroll slider. */}
      <div
        className="team__cards"
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        role="group"
        aria-label="Our dentists"
      >
        <div className="team__track">
          <div className="team__group">
            {members.map((m, i) => (
              <Card m={m} key={`a-${i}`} />
            ))}
          </div>
          <div className="team__group" aria-hidden="true">
            {members.map((m, i) => (
              <Card m={m} key={`b-${i}`} />
            ))}
          </div>
        </div>
      </div>

      {/* bullet dots — mobile only (like the Before/After slider) */}
      <div className="dots team__dots" role="tablist" aria-label="Team slides">
        {Array.from({ length: dots }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`dots__btn${i === active ? ' on' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === active}
            onClick={() => goToDot(i)}
          />
        ))}
      </div>
    </section>
  );
}
