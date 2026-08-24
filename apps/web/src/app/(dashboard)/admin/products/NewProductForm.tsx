'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { createProduct, type ProductFormState } from './actions';

const INITIAL: ProductFormState = {};

export function NewProductForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createProduct, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the fields after a successful save so the next entry starts blank.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  if (!open) {
    return (
      <button className="dash__primary" type="button" onClick={() => setOpen(true)}>
        Add product
      </button>
    );
  }

  return (
    <form className="dash__form" action={action} ref={formRef}>
      <div className="dash__formgrid">
        <div className="dash__field">
          <label className="dash__label" htmlFor="name">
            Name
          </label>
          <input
            className="dash__input"
            id="name"
            name="name"
            placeholder="Moves Full"
            required
            autoFocus
          />
        </div>

        <div className="dash__field">
          <label className="dash__label" htmlFor="price">
            Price (£)
          </label>
          <input
            className="dash__input"
            id="price"
            name="price"
            inputMode="decimal"
            placeholder="2400"
            required
          />
        </div>
      </div>

      <div className="dash__field">
        <label className="dash__label" htmlFor="description">
          Description <span className="dash__optional">optional</span>
        </label>
        <textarea
          className="dash__input dash__textarea"
          id="description"
          name="description"
          rows={2}
          placeholder="Full arch treatment, start to finish."
        />
      </div>

      <label className="dash__check">
        <input type="checkbox" name="active" defaultChecked />
        Available to order
      </label>

      {state.error ? (
        <p className="dash__formerror" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="dash__formok" role="status">
          Product saved.
        </p>
      ) : null}

      <div className="dash__formactions">
        <button className="dash__primary" type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save product'}
        </button>
        <button className="dash__ghost" type="button" onClick={() => setOpen(false)}>
          Done
        </button>
      </div>
    </form>
  );
}
