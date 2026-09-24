'use client';

import { useState } from 'react';
import { requestSignupLink } from './actions';

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

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

export function SignupModal({ googleEnabled }: { googleEnabled: boolean }) {
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

        <div className="su__or"><span>or</span></div>

        <a
          className={`su__google ${googleEnabled ? '' : 'is-disabled'}`}
          href={googleEnabled ? '/api/auth/google' : undefined}
          aria-disabled={!googleEnabled}
          onClick={(e) => { if (!googleEnabled) e.preventDefault(); }}
        >
          <GoogleG />
          Continue with Google
        </a>
        {!googleEnabled ? <p className="su__note">Google sign-in activates once it&apos;s configured.</p> : null}
      </div>

      <p className="su__terms">
        By signing up, you agree to the MOVES <a href="/terms">Terms</a> and <a href="/privacy-policy">Privacy Policy</a>. Unsubscribe anytime.
      </p>
    </div>
  );
}
