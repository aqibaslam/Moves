import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import { SignupModal } from './SignupModal';
import './signup.css';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
});

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Sign up to be among the first to try MOVES — launch news, smile tips and member-only offers.',
};

const PANEL_POINTS = [
  'Every treatment plan signed by a named, GDC-registered dentist',
  'Progress checked at every tray change',
  '30-day money-back guarantee',
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export default function SignupPage() {
  return (
    <div className={`su ${jost.variable}`}>
      <div className="su__panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="su__photo"
          src="/images/signup-hero.jpg"
          alt="Smiling woman holding her MOVES aligner case"
        />
        <div className="su__scrim" aria-hidden="true" />

        {/* mobile-only top bar over the photo */}
        <div className="su__bar">
          <span className="su__wordmark">MOVES<span className="su__wordmark-mark">&rsquo;</span></span>
          <a className="su__help" href="mailto:support@movesuk.com">Need help?</a>
        </div>

        {/* desktop-only headline + checklist */}
        <div className="su__panel-content">
          <p className="su__panel-headline">The smile you&rsquo;ve been<br />putting off starts here.</p>
          <ul className="su__panel-list">
            {PANEL_POINTS.map((point) => (
              <li className="su__panel-item" key={point}>
                <span className="su__panel-check" aria-hidden="true"><CheckIcon /></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="su__side">
        <span className="su__glow su__glow--coral" aria-hidden="true" />
        <span className="su__glow su__glow--navy" aria-hidden="true" />
        <SignupModal />
        <div className="su__side-foot" aria-hidden="false">
          <span className="su__secure">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2.5" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            Secure subscription
          </span>
          <span>&copy; 2026 MOVES</span>
        </div>
      </div>
    </div>
  );
}
