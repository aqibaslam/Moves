import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { MovesMark } from '../MovesMark';
import { getAdminUser, isPreviewMode } from '../lib/auth';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

function safePath(raw?: string): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard';
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Already signed in → skip the form.
  if (await getAdminUser()) redirect('/dashboard');

  const { next } = await searchParams;
  const preview = isPreviewMode();

  return (
    <main className="dash-login">
      <div className="dash-login__card">
        <MovesMark className="dash-login__mark" />
        <p className="dash-login__brand">MOVES</p>

        <h1 className="dash-login__title">Practice dashboard</h1>
        <p className="dash-login__sub">
          Sign in to manage orders, consultations, and clinic performance.
        </p>

        <LoginForm next={safePath(next)} />

        {preview ? (
          <p className="dash-login__hint">
            <strong>Preview mode.</strong> No Supabase project is configured, so any email works
            with the password <code>moves-admin</code>. Wire up Supabase and this fallback
            disables itself.
          </p>
        ) : null}

        <p className="dash-login__foot">Authorised clinic staff only.</p>
      </div>
    </main>
  );
}
