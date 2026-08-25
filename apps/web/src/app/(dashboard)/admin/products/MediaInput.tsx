'use client';

import { useEffect, useRef, useState } from 'react';

type Item = { file: File; url: string };

/**
 * Accumulating multi-file picker with thumbnail previews.
 *
 * A native <input type="file" multiple> replaces its FileList on every pick,
 * so you can't add images one at a time. We hold the chosen files in React
 * state and keep a hidden input's .files in sync (via DataTransfer) so the
 * surrounding <form> still submits them under `name` to the server action.
 */
export function MediaInput({ name, existing = [] }: { name: string; existing?: string[] }) {
  const [items, setItems] = useState<Item[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickRef = useRef<HTMLInputElement>(null);

  // Mirror `items` into the hidden submitted input.
  useEffect(() => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    items.forEach((it) => dt.items.add(it.file));
    inputRef.current.files = dt.files;
  }, [items]);

  // Revoke object URLs on unmount to avoid leaks.
  useEffect(() => () => items.forEach((it) => URL.revokeObjectURL(it.url)), [items]);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const incoming = Array.from(list);
    setItems((prev) => {
      const seen = new Set(prev.map((p) => `${p.file.name}:${p.file.size}`));
      const next = [...prev];
      for (const file of incoming) {
        const key = `${file.name}:${file.size}`;
        if (seen.has(key)) continue; // skip duplicates
        seen.add(key);
        next.push({ file, url: URL.createObjectURL(file) });
      }
      return next;
    });
    // reset the picker so the same file can be re-chosen later if removed
    if (pickRef.current) pickRef.current.value = '';
  };

  const removeAt = (i: number) => {
    setItems((prev) => {
      const it = prev[i];
      if (it) URL.revokeObjectURL(it.url);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  return (
    <div className="pe__field">
      <span className="pe__label">Media</span>

      {/* files actually submitted with the form */}
      <input ref={inputRef} type="file" name={name} multiple className="pe__hidden" tabIndex={-1} aria-hidden="true" />
      {/* the picker the user clicks */}
      <input
        ref={pickRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="pe__hidden"
        onChange={(e) => addFiles(e.currentTarget.files)}
      />

      {existing.length > 0 ? (
        <div className="pe__media" style={{ marginBottom: 10 }}>
          {existing.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <div className="pe__thumb" key={src}><img src={src} alt="" /></div>
          ))}
        </div>
      ) : null}

      {items.length === 0 ? (
        <button type="button" className="pe__drop pe__drop--live" onClick={() => pickRef.current?.click()}>
          <strong>{existing.length ? 'Add more images' : 'Upload new'}</strong> — click to choose files
          <br />
          Images or video. You can add more one at a time.
        </button>
      ) : (
        <div className="pe__media">
          {items.map((it, i) => (
            <div className="pe__thumb" key={it.url}>
              {it.file.type.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.url} alt={it.file.name} />
              ) : (
                <span className="pe__thumbfile">{it.file.name}</span>
              )}
              {i === 0 ? <span className="pe__badge">Primary</span> : null}
              <button
                type="button"
                className="pe__thumbx"
                onClick={() => removeAt(i)}
                aria-label={`Remove ${it.file.name}`}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className="pe__addtile" onClick={() => pickRef.current?.click()} aria-label="Add more images">
            <span>＋</span>
            Add
          </button>
        </div>
      )}

      <span className="pe__hint">The first image is the primary, shown first everywhere.</span>
    </div>
  );
}
