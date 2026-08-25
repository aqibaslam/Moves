'use client';

import { useState } from 'react';
import { setFulfillment } from '../actions';

export function FulfillButton({ orderId, fulfilled }: { orderId: number; fulfilled: boolean }) {
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState(fulfilled);

  async function toggle() {
    setBusy(true);
    const res = await setFulfillment(orderId, state ? 'unfulfilled' : 'fulfilled');
    setBusy(false);
    if (res.ok) setState(!state);
  }

  return (
    <button className={state ? 'od__fulfilled' : 'od__fulfill'} type="button" onClick={toggle} disabled={busy}>
      {busy ? 'Saving…' : state ? 'Fulfilled ✓ — undo' : 'Mark as fulfilled'}
    </button>
  );
}
