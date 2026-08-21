import type { CollectionConfig } from 'payload';

/**
 * Treatment plans the practice sells (Moves Full, Lite, Refine…).
 * Read is public so the marketing site can render pricing; writes require a
 * signed-in team member.
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
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Shown to patients, e.g. "Moves Full".' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'URL-safe id. Leave blank to derive from the name.' },
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
      name: 'pricePence',
      type: 'number',
      required: true,
      min: 0,
      label: 'Price (pence)',
      admin: {
        description:
          'Integer pence — 240000 is £2,400. Money is never stored as a float; rounding errors compound across a ledger.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Short summary shown on the pricing card.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Unticked products stay in past orders but cannot be ordered again.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional product image.' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first.' },
    },
  ],
};
