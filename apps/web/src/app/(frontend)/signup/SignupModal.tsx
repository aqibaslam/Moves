'use client';

import { useState } from 'react';
import { requestSignupLink } from './actions';

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
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
  const [sent, setSent] = useState<{ emailed: boolean; devLink?: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const res = await requestSignupLink(email);
    setBusy(false);
    if (res.ok) setSent({ emailed: res.emailed, devLink: res.devLink });
    else setError(res.error);
  }

  if (sent) {
    return (
      <div className="su__card">
        <div className="su__head">
          <span className="su__mailicon" aria-hidden="true"><MailIcon /></span>
          <h1 className="su__title">Check your inbox</h1>
          <p className="su__sub">
            {sent.emailed
              ? <>We&apos;ve sent a one-time link to <strong>{email}</strong>. Open it to finish and you&apos;ll be signed in.</>
              : <>Your account is started. Email isn&apos;t switched on yet — use this one-time link to confirm:</>}
          </p>
        </div>
        {sent.devLink ? <a className="su__devlink" href={sent.devLink}>Confirm my email <ArrowIcon /></a> : null}
        <button className="su__reset" type="button" onClick={() => setSent(null)}>Use a different email</button>
      </div>
    );
  }

  return (
    <div className="su__card">
      <div className="su__head">
        <h1 className="su__title">Sign up to<br />MOVES</h1>
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
