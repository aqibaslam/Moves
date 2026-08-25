'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveCustomer, type CustomerInput } from './actions';

export type CustomerInitial = Omit<CustomerInput, 'id'> & { id?: number };

export function CustomerForm({ initial }: { initial?: CustomerInitial }) {
  const router = useRouter();
  const editing = Boolean(initial?.id);
  const [c, setC] = useState<CustomerInitial>(
    initial ?? { name: '', email: '', phone: '', line1: '', line2: '', city: '', postcode: '', country: 'United Kingdom', notes: '' },
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof CustomerInitial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setC({ ...c, [k]: e.target.value });

  async function submit() {
    setBusy(true); setError(null); setSaved(false);
    const res = await saveCustomer({ ...c, id: initial?.id });
    setBusy(false);
    if (res.ok) {
      if (editing) { setSaved(true); router.refresh(); }
      else router.push(`/admin/customers/${res.id}`);
    } else setError(res.error);
  }

  return (
    <div className="pe__card">
      <div className="pe__cardtitle">{editing ? 'Edit customer' : 'Customer details'}</div>
      {error ? <p className="pe__error" role="alert">{error}</p> : null}
      {saved ? <p className="pe__formok" role="status">Saved.</p> : null}
      <div className="pe__field"><label className="pe__label">Name</label><input className="pe__input" value={c.name} onChange={set('name')} placeholder="Jane Doe" /></div>
      <div className="pe__field"><label className="pe__label">Email</label><input className="pe__input" type="email" value={c.email} onChange={set('email')} placeholder="jane@example.com" /></div>
      <div className="pe__field"><label className="pe__label">Phone</label><input className="pe__input" value={c.phone ?? ''} onChange={set('phone')} placeholder="07700 900000" /></div>
      <div className="pe__divider" />
      <div className="pe__field"><label className="pe__label">Address line 1</label><input className="pe__input" value={c.line1 ?? ''} onChange={set('line1')} /></div>
      <div className="pe__field"><label className="pe__label">Address line 2</label><input className="pe__input" value={c.line2 ?? ''} onChange={set('line2')} /></div>
      <div className="pe__row2">
        <div className="pe__field"><label className="pe__label">City</label><input className="pe__input" value={c.city ?? ''} onChange={set('city')} /></div>
        <div className="pe__field"><label className="pe__label">Postcode</label><input className="pe__input" value={c.postcode ?? ''} onChange={set('postcode')} /></div>
      </div>
      <div className="pe__field"><label className="pe__label">Country</label><input className="pe__input" value={c.country ?? ''} onChange={set('country')} /></div>
      <div className="pe__field"><label className="pe__label">Notes</label><textarea className="pe__textarea" style={{ minHeight: 60 }} value={c.notes ?? ''} onChange={set('notes')} /></div>
      <div className="pe__formactions">
        <button className="dash__primary" type="button" onClick={submit} disabled={busy}>
          {busy ? 'Saving…' : editing ? 'Save changes' : 'Create customer'}
        </button>
      </div>
    </div>
  );
}
