import { BOOKING_PATH } from '@/lib/booking/links';

/* "Transform Your Smile with Composite Bonding Today" (Figma 984:7877) — reuses
   the clear-aligners assessment design (`.ca-assess`): a full-bleed navy card with
   the treatment photo baked into the background; heading, lead, coral CTA and three
   badge chips sit overlaid on the left. Navy background image is overridden for the
   composite page in composite-bonding.css. */

const CHIPS = [
  {
    label: 'Experienced cosmetic team',
    icon: (
      <svg viewBox="0 0 30 30" width="20" height="20" fill="none" aria-hidden="true">
        <path
          d="M11.2499 7.50089C11.8749 8.12589 13.129 8.01624 14.9999 6.47128M14.9999 6.47128C14.7231 6.24278 14.4356 5.98316 14.1386 5.68878C11.2565 2.83288 7.33137 3.39203 5.49236 5.68878C4.22218 7.27514 0.971774 11.2241 8.92757 25.3004C9.25696 25.8832 9.91313 26.2509 10.6199 26.2509C11.7474 26.2509 12.6286 25.351 12.6653 24.3008C12.743 22.0733 13.1745 19.5053 14.9999 19.5053C16.8253 19.5053 17.2568 22.0733 17.3345 24.3008C17.3711 25.351 18.2524 26.2509 19.3799 26.2509C20.0866 26.2509 20.7428 25.8832 21.0721 25.3004C29.028 11.2241 25.7776 7.27514 24.5074 5.68878C22.6684 3.39203 18.7433 2.83288 15.8611 5.68878C15.5641 5.98316 15.2766 6.24278 14.9999 6.47128Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Tailored bonding plans',
    icon: (
      <svg viewBox="0 0 30 30" width="20" height="20" fill="none" aria-hidden="true">
        <path
          d="M3.74987 15.0009C9.37488 15.0009 14.9999 9.37589 14.9999 3.75088C14.9999 9.37589 20.6249 15.0009 26.2499 15.0009C20.6249 15.0009 14.9999 20.6259 14.9999 26.2509C14.9999 20.6259 9.37488 15.0009 3.74987 15.0009Z"
          stroke="currentColor"
          strokeWidth="1.45161"
          strokeLinejoin="round"
        />
        <path
          d="M2.50059 24.376C3.54225 24.376 5.62559 22.2926 5.62559 21.251C5.62559 22.2926 7.70893 24.376 8.7506 24.376C7.70893 24.376 5.62559 26.4593 5.62559 27.501C5.62559 26.4593 3.54225 24.376 2.50059 24.376Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
        <path
          d="M20.0007 6.25059C21.2507 6.25059 23.7507 3.75059 23.7507 2.50059C23.7507 3.75059 26.2507 6.25059 27.5007 6.25059C26.2507 6.25059 23.7507 8.7506 23.7507 10.0006C23.7507 8.7506 21.2507 6.25059 20.0007 6.25059Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Natural-looking results',
    icon: (
      <svg viewBox="0 0 28 28" width="20" height="20" fill="none" aria-hidden="true">
        <path
          d="M13.6238 10.1195C13.7994 9.84358 14.2022 9.84358 14.3777 10.1195L14.8858 10.9177C15.4476 11.8004 16.1962 12.5491 17.0789 13.1108L17.8771 13.6188C18.153 13.7945 18.153 14.1972 17.8771 14.3728L17.0789 14.8809C16.1962 15.4426 15.4476 16.1913 14.8858 17.074L14.3777 17.8722C14.2022 18.1481 13.7994 18.1481 13.6238 17.8722L13.1158 17.074C12.554 16.1913 11.8054 15.4426 10.9226 14.8809L10.1244 14.3728C9.84851 14.1972 9.84851 13.7945 10.1244 13.6188L10.9226 13.1108C11.8054 12.5491 12.554 11.8004 13.1158 10.9177L13.6238 10.1195Z"
          stroke="currentColor"
          strokeWidth="1.3871"
          strokeLinejoin="round"
        />
        <path
          d="M4.55711 6.16494C8.01588 6.41522 10.2461 2.91377 14.0297 2.91377C17.7567 2.83943 19.5804 6.2117 23.4012 6.2117C25.4495 16.6377 21.1883 23.187 14.0609 25.079C7.45406 23.5086 2.48981 16.8923 4.55711 6.16494Z"
          stroke="currentColor"
          strokeWidth="1.3871"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function CompositeAssessment() {
  return (
    <section className="ca-assess cb-assess">
      {/* mobile-only: the treatment photo at the top of the card (desktop shows the
          navy scene as the section background instead) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ca-assess__photo" src="/images/composite-assess-mobile.png" alt="A patient during a composite bonding assessment" />
      <div className="ca-assess__inner">
        <div className="ca-assess__col">
          <div className="ca-assess__intro">
            <h2 className="ca-assess__title">
              Transform your smile with composite bonding{' '}
              <span className="ca-assess__accent">today</span>
            </h2>
            <p className="ca-assess__lead">
              Connect with our expert dental specialists to discuss your smile goals, correct chips,
              gaps or uneven edges, and discover whether composite bonding is the right treatment for
              you.
            </p>
          </div>
          <a className="btn lp26-btn ca-assess__cta" href={BOOKING_PATH}>
            Book Free Consultation
          </a>
          <ul className="ca-assess__pills">
            {CHIPS.map((c, i) => (
              <li className="ca-assess__pill" key={c.label}>
                <span className="ca-assess__pill-icon" aria-hidden="true">
                  {c.icon}
                </span>
                <span className="ca-assess__pill-label">{c.label}</span>
                {i < CHIPS.length - 1 && <span className="ca-assess__pill-div" aria-hidden="true" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
