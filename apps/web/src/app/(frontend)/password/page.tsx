import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GATE_COOKIE, GATE_TOKEN } from './gate';
import { PasswordForm } from './PasswordForm';
import '@moves/design-tokens/css';
import './password.css';

export const metadata: Metadata = {
  title: 'Password required',
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
          <span className="pw__status">Private review</span>
        </header>

        <div className="pw__content">
          <p className="pw__eyebrow">Brand team preview · Clear aligners</p>
          <h1 className="pw__title" id="review-title">
            The next <span>Move.</span><br />is ready.
          </h1>
          <p className="pw__sub">
            A private preview of the new MOVES clear aligner landing page. Enter the review
            password to <strong>see the complete experience.</strong>
          </p>
          <PasswordForm from={safePath(from)} />
        </div>

        <footer className="pw__footer">
          <span><strong>London clinic</strong> · Clinician-led care</span>
          <span>Review access only</span>
        </footer>
      </section>

      <aside className="pw__visual" aria-hidden="true">
        <img className="pw__visual-image" src="/results-a/ebcc3d26-30da-4d31-aca9-0b9955204410.jpg" alt="" />
        <div className="pw__visual-caption">
          <span className="pw__visual-index">01 / Private review</span>
          <p className="pw__visual-line">Make your <em>Move.</em></p>
        </div>
      </aside>
    </main>
  );
}
