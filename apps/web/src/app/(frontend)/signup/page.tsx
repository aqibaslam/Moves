import type { Metadata } from 'next';
import '@moves/design-tokens/css';
import { SignupModal } from './SignupModal';
import './signup.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Sign up to be among the first to try MOVES — launch news, smile tips and member-only offers.',
};

export default function SignupPage() {
  return (
    <main className="su" id="main">
      <section className="su__panel" aria-label="MOVES clear aligners">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="su__photo"
          src="/images/signup-hero.jpg"
          alt="Smiling woman holding her MOVES aligner case"
        />
        <div className="su__scrim" aria-hidden="true" />

        {/* mobile-only top bar over the photo */}
        <div className="su__bar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="su__wordmark" src="/images/brand/moves-logo-milk.svg" alt="MOVES" width="300" height="67" />
        </div>

        {/* desktop-only headline + checklist */}
        <div className="su__panel-content">
          <p className="su__panel-headline">The smile you&rsquo;ve been putting off starts here.</p>
        </div>
        <span className="su__photo-accent" aria-hidden="true" />
      </section>

      <div className="su__product" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/funnel2026-cta-case.png" alt="" />
      </div>

      <section className="su__side" aria-label="Email signup">
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
      </section>
    </main>
  );
}
