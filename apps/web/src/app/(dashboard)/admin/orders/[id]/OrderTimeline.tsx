'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addComment } from '../actions';

export type TimelineItem = { kind?: string | null; text?: string | null; author?: string | null; at?: string | null };

const when = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '';

function icon(kind?: string | null) {
  if (kind === 'comment') return '💬';
  if (kind === 'email') return '✉️';
  return '•';
}

export function OrderTimeline({ orderId, items }: { orderId: number; items: TimelineItem[] }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  // Newest first.
  const ordered = [...items].reverse();

  async function post() {
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    const res = await addComment(orderId, body);
    setBusy(false);
    if (res.ok) { setText(''); router.refresh(); }
  }

  return (
    <section className="dash__card">
      <div className="tl__head">Timeline</div>
      <div className="tl__compose">
        <textarea
          className="pe__textarea"
          style={{ minHeight: 60 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Leave a comment…"
          disabled={busy}
        />
        <div className="tl__composeactions">
          <button className="dash__primary" type="button" onClick={post} disabled={busy || !text.trim()}>
            {busy ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>

      {ordered.length === 0 ? (
        <p className="dash__empty" style={{ padding: '20px' }}>No activity yet.</p>
      ) : (
        <ul className="tl__list">
          {ordered.map((e, i) => (
            <li className="tl__item" key={i}>
              <span className="tl__icon" aria-hidden="true">{icon(e.kind)}</span>
              <div className="tl__body">
                <p className="tl__text">{e.text}</p>
                <p className="tl__meta">{[e.author, when(e.at)].filter(Boolean).join(' · ')}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
