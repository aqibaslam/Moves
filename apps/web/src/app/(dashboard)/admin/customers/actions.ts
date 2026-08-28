'use server';

import config from '@payload-config';
import { revalidatePath } from 'next/cache';
import { getPayload } from 'payload';
import { getPayloadUser } from '../../lib/auth';

export type CustomerInput = {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  notes?: string;
};
export type CustomerResult = { ok: true; id: number } | { ok: false; error: string };

export async function saveCustomer(input: CustomerInput): Promise<CustomerResult> {
  const user = await getPayloadUser();
  if (!user) return { ok: false, error: 'You need to be signed in.' };
  const name = input.name?.trim();
  const email = input.email?.trim();
  if (!name || !email) return { ok: false, error: 'Enter a name and email.' };

  const payload = await getPayload({ config });
  const data = {
    name,
    email,
    phone: input.phone?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    address: {
      line1: input.line1?.trim() || undefined,
      line2: input.line2?.trim() || undefined,
      city: input.city?.trim() || undefined,
      postcode: input.postcode?.trim() || undefined,
      country: input.country?.trim() || 'United Kingdom',
    },
  };

  try {
    if (input.id) {
      await payload.update({ collection: 'customers', id: input.id, user, overrideAccess: false, data });
      revalidatePath(`/admin/customers/${input.id}`);
      revalidatePath('/admin/customers');
      return { ok: true, id: input.id };
    }
    // New — block a duplicate email.
    const dupe = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, user, overrideAccess: false });
    if (dupe.docs[0]) return { ok: false, error: 'A customer with that email already exists.' };
    const created = await payload.create({ collection: 'customers', user, overrideAccess: false, data });
    revalidatePath('/admin/customers');
    return { ok: true, id: created.id as number };
  } catch (err) {
    console.error('[customers] saveCustomer failed', err);
    return { ok: false, error: 'Could not save the customer. Please try again.' };
  }
}
