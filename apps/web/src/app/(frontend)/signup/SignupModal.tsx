'use client';

import Link from 'next/link';
import { useState } from 'react';
import { requestSignupLink } from './actions';

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
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
        <div className="su__mailicon" aria-hidden="true">✉️</div>
        <h1 className="su__title">Check your inbox</h1>
        <p className="su__inbox">
          {sent.emailed
            ? <>We&apos;ve sent a one-time link to <strong>{email}</strong>. Open it to finish and you&apos;ll be signed in.</>
            : <>Your account is started. Email isn&apos;t switched on yet — use this one-time link to confirm:</>}
        </p>
        {sent.devLink ? <a className="su__devlink" href={sent.devLink}>Confirm my email →</a> : null}
        <button className="su__reset" type="button" onClick={() => setSent(null)}>Use a different email</button>
      </div>
    );
  }

  return (
    <div className="su__card">
      <h1 className="su__title">Sign up</h1>

      <form className="su__form" onSubmit={submit}>
        <input
          className="su__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          required
          autoFocus
        />
        {error ? <p className="su__error" role="alert">{error}</p> : null}
        <button className="su__submit" type="submit" disabled={busy}>
          {busy ? 'Sending…' : 'Submit'}
        </button>
      </form>

      <p className="su__account">
        Do not have an account? <Link href="/signup" className="su__signin">Sign in</Link>
      </p>

      <div className="su__or">OR</div>

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
  );
}
