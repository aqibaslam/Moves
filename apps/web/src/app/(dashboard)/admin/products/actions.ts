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


/**
 * Uploads any files from the Media field into the `media` collection (which is
 * backed by Vercel Blob in production) and returns their ids. Best-effort per
 * file: a bad upload is skipped, not fatal to the whole save.
 */
async function uploadMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  files: File[],
): Promise<number[]> {
  const ids: number[] = [];
  for (const file of files) {
    if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) continue;
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const doc = await payload.create({
        collection: 'media',
        data: { alt: file.name },
        file: {
          data: buffer,
          mimetype: file.type || 'application/octet-stream',
          name: file.name,
          size: file.size,
        },
      });
      ids.push(doc.id as number);
    } catch (err) {
      console.error('[products] media upload failed for', file.name, err);
    }
  }
  return ids;
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

  const mediaFiles = formData.getAll('media').filter((f): f is File => f instanceof File);
  const mediaIds = await uploadMedia(payload, mediaFiles);
  const [primaryImage, ...galleryIds] = mediaIds;

  try {
    const doc = await payload.create({
      collection: 'products',
      user,
      overrideAccess: false,
      data: {
        name,
        slug: str(formData.get('handle')),
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
        image: primaryImage ?? undefined,
        gallery: galleryIds.length ? galleryIds.map((id) => ({ file: id })) : undefined,
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

export async function updateProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await getPayloadUser();
  if (!user) return { error: 'You need to be signed in to edit a product.' };

  const id = Number(formData.get('id'));
  if (!Number.isFinite(id)) return { error: 'Missing product id.' };

  const name = String(formData.get('name') ?? '').trim();
  if (!name) return { error: 'Give the product a title.' };

  const pricePence = poundsToPence(formData.get('price'));
  if (pricePence === null) return { error: 'Enter the price as a number, e.g. 2400.' };

  const compareAtPence = poundsToPence(formData.get('compareAt'));
  const costPerItemPence = poundsToPence(formData.get('costPerItem'));
  const tags = String(formData.get('tags') ?? '').split(',').map((t) => t.trim()).filter(Boolean);

  const payload = await getPayload({ config });

  // Newly attached images append to the existing gallery; the primary image is
  // left as-is unless there wasn't one.
  const mediaFiles = formData.getAll('media').filter((f): f is File => f instanceof File);
  const newIds = await uploadMedia(payload, mediaFiles);

  try {
    const current = await payload.findByID({ collection: 'products', id });
    const currentImage = typeof current.image === 'object' && current.image ? current.image.id : current.image;
    const currentGallery = (current.gallery ?? [])
      .map((g) => (typeof g.file === 'object' && g.file ? g.file.id : g.file))
      .filter((v): v is number => typeof v === 'number');

    let image = currentImage as number | undefined;
    const galleryIds = [...currentGallery];
    for (const nid of newIds) {
      if (image == null) image = nid;
      else galleryIds.push(nid);
    }

    await payload.update({
      collection: 'products',
      id,
      user,
      overrideAccess: false,
      data: {
        name,
        slug: str(formData.get('handle')),
        description: str(formData.get('description')),
        category: str(formData.get('category')),
        pricePence,
        compareAtPence: compareAtPence ?? null,
        costPerItemPence: costPerItemPence ?? null,
        chargeTax: formData.get('chargeTax') === 'on',
        trackQuantity: formData.get('trackQuantity') === 'on',
        quantity: intOrUndef(formData.get('quantity')) ?? 0,
        sku: str(formData.get('sku')) ?? null,
        barcode: str(formData.get('barcode')) ?? null,
        continueSellingWhenOutOfStock: formData.get('continueSelling') === 'on',
        physicalProduct: formData.get('physicalProduct') === 'on',
        weightGrams: intOrUndef(formData.get('weight')) ?? null,
        active: formData.get('status') !== 'draft',
        productType: str(formData.get('productType')) ?? null,
        vendor: str(formData.get('vendor')) ?? null,
        tags,
        image: image ?? null,
        gallery: galleryIds.map((gid) => ({ file: gid })),
        seoTitle: str(formData.get('seoTitle')) ?? null,
        seoDescription: str(formData.get('seoDescription')) ?? null,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/admin');
    return { ok: true, id };
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (/unique|duplicate/i.test(message)) return { error: 'A product with that handle already exists.' };
    return { error: 'Could not save your changes. Please try again.' };
  }
}
