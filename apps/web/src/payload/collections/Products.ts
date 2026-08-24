import type { CollectionConfig } from 'payload';

/**
 * Products the practice sells (treatment plans like Moves Full / Lite / Refine,
 * plus any add-ons). The field set mirrors a Shopify-style product editor so
 * the dashboard's "Add product" screen can offer the same sections — adapted
 * for a treatment-plan store rather than physical retail goods.
 *
 * Money is stored as integer pence throughout. Never a float: rounding errors
 * compound across a ledger.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products' },
  admin: {
    group: 'Store',
    useAsTitle: 'name',
    description: 'Treatment plans and add-ons available to order.',
    defaultColumns: ['name', 'pricePence', 'active', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // ── Title + description ──────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Product title, e.g. "Moves Full".' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'URL-safe id. Leave blank to derive from the title.' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = typeof value === 'string' && value.trim() ? value : (data?.name ?? '');
            return String(source)
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Shown on the product / pricing card.' },
    },

    // ── Media ────────────────────────────────────────────────
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Primary image, shown first everywhere.' },
    },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Image', plural: 'Media' },
      admin: { description: 'Additional images or video.' },
      fields: [{ name: 'file', type: 'upload', relationTo: 'media', required: true }],
    },

    {
      name: 'category',
      type: 'text',
      admin: { description: 'e.g. "Clear aligners", "Whitening", "Retainers".' },
    },

    // ── Pricing (integer pence) ──────────────────────────────
    {
      name: 'pricePence',
      type: 'number',
      required: true,
      min: 0,
      label: 'Price (pence)',
      admin: { description: '240000 = £2,400.' },
    },
    {
      name: 'compareAtPence',
      type: 'number',
      min: 0,
      label: 'Compare-at price (pence)',
      admin: { description: 'Original price, shown struck through. Optional.' },
    },
    {
      name: 'costPerItemPence',
      type: 'number',
      min: 0,
      label: 'Cost per item (pence)',
      admin: { description: 'Your cost. Used for margin, never shown to patients.' },
    },
    {
      name: 'chargeTax',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Charge tax on this product.' },
    },

    // ── Inventory ────────────────────────────────────────────
    {
      name: 'trackQuantity',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Track how many are available.' },
    },
    {
      name: 'quantity',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Units available.',
        condition: (data) => Boolean(data?.trackQuantity),
      },
    },
    { name: 'sku', type: 'text', label: 'SKU', admin: { description: 'Stock keeping unit.' } },
    { name: 'barcode', type: 'text', admin: { description: 'Barcode (ISBN, UPC, GTIN…).' } },
    {
      name: 'continueSellingWhenOutOfStock',
      type: 'checkbox',
      defaultValue: false,
    },

    // ── Shipping ─────────────────────────────────────────────
    {
      name: 'physicalProduct',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Untick for a service (no shipping).' },
    },
    {
      name: 'weightGrams',
      type: 'number',
      min: 0,
      label: 'Weight (grams)',
      admin: { condition: (data) => Boolean(data?.physicalProduct) },
    },

    // ── Status + organization (sidebar) ──────────────────────
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        position: 'sidebar',
        description: 'Active products can be ordered. Untick = Draft.',
      },
    },
    {
      name: 'productType',
      type: 'text',
      label: 'Type',
      admin: { position: 'sidebar' },
    },
    { name: 'vendor', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { position: 'sidebar', description: 'Comma-separated labels.' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },

    // ── SEO ──────────────────────────────────────────────────
    {
      name: 'seoTitle',
      type: 'text',
      admin: { description: 'Search engine title. Defaults to the product title.' },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: { description: 'Search engine description.' },
    },
  ],
};
