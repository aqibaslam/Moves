'use client';

import { useState } from 'react';
import { addTag, removeTag } from '../actions';

export function OrderTags({ orderId, initial }: { orderId: number; initial: string[] }) {
  const [tags, setTags] = useState<string[]>(initial);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);

  async function add() {
    const t = value.trim();
    if (!t || busy) return;
    setBusy(true);
    const res = await addTag(orderId, t);
    setBusy(false);
    if (res.ok) { setTags(res.tags); setValue(''); }
  }

  async function drop(tag: string) {
    setBusy(true);
    const res = await removeTag(orderId, tag);
    setBusy(false);
    if (res.ok) setTags(res.tags);
  }

  return (
    <div className="ot">
      <input
        className="pe__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        placeholder="Add a tag and press Enter"
        disabled={busy}
      />
      {tags.length ? (
        <div className="ot__tags">
          {tags.map((t) => (
            <span className="ot__tag" key={t}>
              {t}
              <button type="button" onClick={() => drop(t)} aria-label={`Remove ${t}`} disabled={busy}>×</button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
