import type { CollectionConfig } from 'payload';

export const ORDER_STATUSES = [
  { label: 'Placed', value: 'placed' },
  { label: 'In production', value: 'in_production' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
] as const;

/**
 * A patient's order for a treatment plan. Not publicly readable — every
 * operation requires a signed-in team member.
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Order', plural: 'Orders' },
  admin: {
    group: 'Store',
    useAsTitle: 'reference',
    description: 'Treatment plans ordered by patients.',
    defaultColumns: ['reference', 'patientName', 'status', 'amountPence', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'Human-facing order number. Auto-generated if left blank.' },
    },
    { name: 'patientName', type: 'text', required: true },
    { name: 'patientEmail', type: 'email', required: true },
    { name: 'patientPhone', type: 'text' },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: { description: 'Which treatment plan was ordered.' },
    },
    {
      name: 'amountPence',
      type: 'number',
      required: true,
      min: 0,
      label: 'Amount (pence)',
      admin: {
        description:
          'Copied from the product at order time, then frozen. A later price change must not rewrite historic orders.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'placed',
      options: [...ORDER_STATUSES],
      index: true,
    },
    { name: 'dentist', type: 'text', admin: { description: 'Treating GDC-registered dentist.' } },
    { name: 'clinic', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.reference) {
          // Timestamp-derived so references stay roughly sequential without a
          // counter table. Collisions are caught by the unique index.
          data.reference = `MV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
        }
        return data;
      },
    ],
  },
};
