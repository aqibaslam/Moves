import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GATE_COOKIE, GATE_TOKEN } from './gate';
import { PasswordForm } from './PasswordForm';
import '@moves/design-tokens/css';
import './password.css';

export const metadata: Metadata = {
  title: 'Password protected',
  robots: { index: false, follow: false },
};

function safePath(raw?: string): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
}

export default async function PasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  // already unlocked → don't show the wall again
  const store = await cookies();
  if (store.get(GATE_COOKIE)?.value === GATE_TOKEN) redirect('/');

  const { from } = await searchParams;

  return (
    <main className="pw" id="main">
      <section className="pw__access" aria-labelledby="review-title">
        <header className="pw__header">
          <img className="pw__logo" src="/results-a/8752b7d0-c35f-4d2e-a12e-2dc371d86925.svg" alt="MOVES" />
        </header>

        <div className="pw__content">
          <div className="pw__lock" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7.75 10V7.75a4.25 4.25 0 0 1 8.5 0V10" />
              <rect x="5" y="10" width="14" height="11" />
              <path d="M12 14v3" />
            </svg>
          </div>
          <p className="pw__status">Internal team access</p>
          <h1 className="pw__title" id="review-title">Password protected<span>.</span></h1>
          <p className="pw__intro">Enter the password to unlock the review.</p>
          <PasswordForm from={safePath(from)} />
        </div>
      </section>

      <aside className="pw__visual" aria-hidden="true">
        <img className="pw__visual-image" src="/images/signup-hero.jpg" alt="" />
      </aside>
    </main>
  );
}
