'use server';

import config from '@payload-config';
import { revalidatePath } from 'next/cache';
import { getPayload } from 'payload';
import { getPayloadUser } from '../../lib/auth';

export type ProductFormState = { error?: string; ok?: boolean; id?: number };

/** Pounds ("2,400", "£2400.50") → integer pence. null when unusable/blank. */
function poundsToPence(raw: FormDataEntryValue | null): number | null {
  const cleaned = String(raw ?? '').replace(/[£,\s]/g, '');
  if (!cleaned) return null;
  const pounds = Number(cleaned);
  if (!Number.isFinite(pounds) || pounds < 0) return null;
  return Math.round(pounds * 100);
}

function intOrUndef(raw: FormDataEntryValue | null): number | undefined {
  const s = String(raw ?? '').trim();
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

function str(raw: FormDataEntryValue | null): string | undefined {
  const s = String(raw ?? '').trim();
  return s || undefined;
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await getPayloadUser();
  if (!user) return { error: 'You need to be signed in to add a product.' };

  const name = String(formData.get('name') ?? '').trim();
  if (!name) return { error: 'Give the product a title.' };

  const pricePence = poundsToPence(formData.get('price'));
  if (pricePence === null) return { error: 'Enter the price as a number, e.g. 2400.' };

  const compareAtPence = poundsToPence(formData.get('compareAt'));
  const costPerItemPence = poundsToPence(formData.get('costPerItem'));

  const tags = String(formData.get('tags') ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const payload = await getPayload({ config });

  try {
    const doc = await payload.create({
      collection: 'products',
      user,
      overrideAccess: false,
      data: {
        name,
        description: str(formData.get('description')),
        category: str(formData.get('category')),
        pricePence,
        compareAtPence: compareAtPence ?? undefined,
        costPerItemPence: costPerItemPence ?? undefined,
        chargeTax: formData.get('chargeTax') === 'on',
        trackQuantity: formData.get('trackQuantity') === 'on',
        quantity: intOrUndef(formData.get('quantity')) ?? 0,
        sku: str(formData.get('sku')),
        barcode: str(formData.get('barcode')),
        continueSellingWhenOutOfStock: formData.get('continueSelling') === 'on',
        physicalProduct: formData.get('physicalProduct') === 'on',
        weightGrams: intOrUndef(formData.get('weight')),
        active: formData.get('status') !== 'draft',
        productType: str(formData.get('productType')),
        vendor: str(formData.get('vendor')),
        tags: tags.length ? tags : undefined,
        seoTitle: str(formData.get('seoTitle')),
        seoDescription: str(formData.get('seoDescription')),
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/admin');
    return { ok: true, id: doc.id as number };
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (/unique|duplicate/i.test(message)) {
      return { error: 'A product with that title already exists.' };
    }
    return { error: 'Could not save the product. Please try again.' };
  }
}
