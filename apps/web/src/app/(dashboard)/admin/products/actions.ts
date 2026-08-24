'use server';

import config from '@payload-config';
import { revalidatePath } from 'next/cache';
import { getPayload } from 'payload';
import { getPayloadUser } from '../../lib/auth';

export type ProductFormState = { error?: string; ok?: boolean };

/**
 * Parses a price typed in pounds ("2400", "2,400", "£2400.50") into integer
 * pence. Returns null when the input isn't a usable number.
 */
function poundsToPence(raw: string): number | null {
  const cleaned = raw.replace(/[£,\s]/g, '');
  if (!cleaned) return null;
  const pounds = Number(cleaned);
  if (!Number.isFinite(pounds) || pounds < 0) return null;
  // Round rather than truncate so "19.99" is 1999 pence, not 1998.
  return Math.round(pounds * 100);
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await getPayloadUser();
  if (!user) return { error: 'You need to be signed in to add a product.' };

  const name = String(formData.get('name') ?? '').trim();
  const priceRaw = String(formData.get('price') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const active = formData.get('active') === 'on';

  if (!name) return { error: 'Give the product a name.' };

  const pricePence = poundsToPence(priceRaw);
  if (pricePence === null) return { error: 'Enter the price as a number, e.g. 2400.' };

  const payload = await getPayload({ config });

  try {
    await payload.create({
      collection: 'products',
      data: {
        name,
        pricePence,
        description: description || undefined,
        active,
      },
      user,
      overrideAccess: false,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    // The slug is derived from the name and uniquely indexed.
    if (/unique|duplicate/i.test(message)) {
      return { error: 'A product with that name already exists.' };
    }
    return { error: 'Could not save the product. Please try again.' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/admin');
  return { ok: true };
}

export async function toggleProductActive(id: number, active: boolean): Promise<void> {
  const user = await getPayloadUser();
  if (!user) return;

  const payload = await getPayload({ config });
  await payload.update({
    collection: 'products',
    id,
    data: { active },
    user,
    overrideAccess: false,
  });

  revalidatePath('/admin/products');
}
