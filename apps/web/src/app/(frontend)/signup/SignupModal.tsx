'use client';

import { useState } from 'react';
import { subscribe } from './actions';

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function SignupModal() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const res = await subscribe(email);
    setBusy(false);
    if (res.ok) setSubscribed(email);
    else setError(res.error);
  }

  if (subscribed) {
    return (
      <div className="su__card su__card--done">
        <div className="su__done">
          <span className="su__check" aria-hidden="true"><CheckIcon /></span>
          <h1 className="su__title">You&rsquo;re subscribed</h1>
          <p className="su__sub">
            Thanks for subscribing to MOVES. We&rsquo;ve sent a confirmation to <strong>{subscribed}</strong>. Look out for launch news, smile tips and member-only offers.
          </p>
        </div>
        <div className="su__hint">
          <span className="su__hint-icon" aria-hidden="true"><MailIcon /></span>
          Can&rsquo;t see it? Check your spam or promotions folder.
        </div>
      </div>
    );
  }

  return (
    <div className="su__card">
      <div className="su__head">
        <h1 className="su__title">
          Sign up to<br />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="su__title-logo" src="/images/lp26-logo.svg" alt="MOVES" width="128" height="29" />
        </h1>
        <p className="su__sub">Sign up to be among the first to try MOVES. We&rsquo;ll keep you posted with launch news, smile tips and member-only offers.</p>
      </div>

      <div className="su__body">
        <form className="su__form" onSubmit={submit}>
          <div className="su__field">
            <label className="su__label" htmlFor="email">Email address</label>
            <div className="su__inputwrap">
              <span className="su__inputicon" aria-hidden="true"><MailIcon /></span>
              <input
                id="email"
                className="su__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                autoFocus
              />
            </div>
          </div>
          {error ? <p className="su__error" role="alert">{error}</p> : null}
          <button className="su__submit" type="submit" disabled={busy}>
            {busy ? 'Sending…' : 'Sign up'}
            {busy ? null : <ArrowIcon />}
          </button>
        </form>
      </div>

      <p className="su__terms">
        By signing up, you agree to the MOVES <a href="/terms">Terms</a> and <a href="/privacy-policy">Privacy Policy</a>. Unsubscribe anytime.
      </p>
    </div>
  );
}
