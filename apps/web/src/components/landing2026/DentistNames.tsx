'use client';

import { useState } from 'react';
import { BOOKING_PATH } from '@/lib/booking/links';

interface Dentist {
  name: string;
  avatar: string;
  photo: string;
  bio: string;
}

/* Placeholder roster — swap avatars/photos + copy for the real dentists. */
const DENTISTS: Dentist[] = [
  {
    name: 'Dr. Amir Hussain',
    avatar: '/images/f26-dentist-1.png',
    photo: '/images/f26-dentist-1-big.png',
    bio: 'Dr. Amir Hussain brings expertise in evidence-led nutrition and preventive health, translating complex science into practical everyday guidance. Their input helps shape a formula designed to be complete, convenient, and easy to use consistently.',
  },
  {
    name: 'Dr. Amelia Hart',
    avatar: '/images/f26-dentist-2.png',
    photo: '/images/f26-dentist-2-big.svg',
    bio: 'Dr. Amelia Hart focuses on aligner-led orthodontics, planning every case in person and signing off each treatment step so patients always know who is responsible for their smile.',
  },
  {
    name: 'Dr. Daniel Cole',
    avatar: '/images/f26-dentist-3.png',
    photo: '/images/f26-dentist-3-big.svg',
    bio: 'Dr. Daniel Cole combines cosmetic dentistry with a patient-first approach, guiding each MOVES plan from first scan through to the final reveal with clear, honest expectations.',
  },
  {
    name: 'Dr. Sophie Ellis',
    avatar: '/images/f26-dentist-4.png',
    photo: '/images/f26-dentist-4-big.svg',
    bio: 'Dr. Sophie Ellis is a GDC-registered dentist who reviews progress at every stage, adjusting treatment when needed so results stay on track and feel natural.',
  },
];

interface Logo {
  label: string;
  src: string;
  w: number;
  h: number;
}

/* Credential + membership logos (extracted from the Figma "names behind the
   smiles" section — white marks that sit on the dark dentist card). */
const CREDS: Logo[] = [
  { label: 'University of Leicester', src: '/images/f26-edu-leicester.svg', w: 126, h: 40 },
  { label: 'Royal College of Surgeons', src: '/images/f26-edu-rcs.svg', w: 117, h: 40 },
  { label: 'King’s College London', src: '/images/f26-edu-kcl.svg', w: 54, h: 40 },
];
const MEMBERSHIPS: Logo[] = [
  { label: 'General Medical Council', src: '/images/f26-mem-gmc.svg', w: 53, h: 41 },
  { label: 'BAHRS', src: '/images/f26-mem-bahrs.svg', w: 58, h: 41 },
];

export function DentistNames() {
  const [active, setActive] = useState(0);
  const d = DENTISTS[active];

  return (
    <section className="lp26-dentists card-section">
      <div className="lp26-dentists__head">
        <h2 className="lp26-dentists__title">
          The names behind the <span className="ink-red">smiles.</span>
        </h2>
        <p className="lp26-dentists__sub">
          Every MOVES plan is signed by one of these dentists. Every one of them is on the GDC
          register, check for yourself.
        </p>
      </div>

      <div className="lp26-dentists__avatars" role="tablist" aria-label="Our dentists">
        {DENTISTS.map((dentist, i) => (
          <button
            key={dentist.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`lp26-dentists__avatar${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dentist.avatar} alt={dentist.name} />
          </button>
        ))}
      </div>

      <article className="lp26-dentists__card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lp26-dentists__photo" src={d.photo} alt={d.name} />
        <div className="lp26-dentists__info">
          <h3 className="lp26-dentists__name">{d.name}</h3>
          <p className="lp26-dentists__role">Moves Verified Dentist</p>
          <p className="lp26-dentists__bio">{d.bio}</p>

          <div className="lp26-dentists__creds">
            <div className="lp26-dentists__cred">
              <p className="lp26-dentists__creds-title">Educational and Medical experience</p>
              <ul className="lp26-dentists__logos">
                {CREDS.map((c) => (
                  <li key={c.label}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.src} alt={c.label} width={c.w} height={c.h} />
                  </li>
                ))}
              </ul>
            </div>
            <span className="lp26-dentists__creds-div" aria-hidden="true" />
            <div className="lp26-dentists__cred">
              <p className="lp26-dentists__creds-title">Professional memberships</p>
              <ul className="lp26-dentists__logos">
                {MEMBERSHIPS.map((m) => (
                  <li key={m.label}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.src} alt={m.label} width={m.w} height={m.h} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a className="btn lp26-btn" href={BOOKING_PATH}>
            Book Free Consultation
          </a>
        </div>
      </article>
    </section>
  );
}
