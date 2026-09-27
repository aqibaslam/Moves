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
      <label className="pw__field-label" htmlFor="review-password">
        Review password
      </label>
      <div className="pw__row">
        <input
          id="review-password"
          className="pw__input"
          type="password"
          name="password"
          placeholder="Enter password"
          autoComplete="off"
          autoFocus
          required
        />
        <button className="pw__btn" type="submit" disabled={pending}>
          {pending ? 'Checking…' : 'View the review'}
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
