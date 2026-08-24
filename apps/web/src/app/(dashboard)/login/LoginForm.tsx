'use client';

import { useActionState } from 'react';
import { signIn, type SignInState } from './actions';

const INITIAL: SignInState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, INITIAL);

  return (
    <form className="dash-login__form" action={action}>
      <input type="hidden" name="next" value={next} />

      <div className="dash-login__field">
        <label className="dash-login__label" htmlFor="email">
          Email
        </label>
        <input
          className="dash-login__input"
          id="email"
          name="email"
          type="email"
          placeholder="you@moves.co"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          autoFocus
        />
      </div>

      <div className="dash-login__field">
        <label className="dash-login__label" htmlFor="password">
          Password
        </label>
        <input
          className="dash-login__input"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error ? (
        <p className="dash-login__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button className="dash-login__btn" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
