'use client';

import { useActionState } from 'react';
import { unlock } from './actions';
import { type UnlockState } from './gate';

const INITIAL: UnlockState = {};

export function PasswordForm({ from }: { from: string }) {
  const [state, action, pending] = useActionState(unlock, INITIAL);

  return (
    <form className="pw__form" action={action}>
      <input type="hidden" name="from" value={from} />
      <div className="pw__row">
        <input
          className="pw__input"
          type="password"
          name="password"
          placeholder="Enter password"
          aria-label="Password"
          autoComplete="off"
          autoFocus
          required
        />
        <button className="pw__btn" type="submit" disabled={pending}>
          {pending ? 'Checking…' : 'Enter'}
        </button>
      </div>
      {state.error ? (
        <p className="pw__error" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
