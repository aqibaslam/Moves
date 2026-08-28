import type { CollectionConfig } from 'payload';

export const ORDER_STATUSES = [
  { label: 'Draft', value: 'draft' },
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
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: { description: 'Who placed the order.' },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: { description: 'Legacy single-line orders. New orders use line items.' },
    },
    {
      name: 'lineItems',
      type: 'array',
      labels: { singular: 'Line item', plural: 'Line items' },
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'quantity', type: 'number', required: true, min: 1, defaultValue: 1 },
        { name: 'unitPricePence', type: 'number', required: true, min: 0 },
      ],
    },
    {
      name: 'amountPence',
      type: 'number',
      min: 0,
      defaultValue: 0,
      label: 'Order total (pence)',
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
    {
      name: 'fulfillmentStatus',
      type: 'select',
      defaultValue: 'unfulfilled',
      options: [
        { label: 'Unfulfilled', value: 'unfulfilled' },
        { label: 'Fulfilled', value: 'fulfilled' },
      ],
      index: true,
    },
    {
      name: 'shippingPence',
      type: 'number',
      min: 0,
      defaultValue: 0,
      label: 'Shipping (pence)',
    },
    { name: 'dentist', type: 'text', admin: { description: 'Treating GDC-registered dentist.' } },
    { name: 'clinic', type: 'text' },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'postcode', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'phone', type: 'text' },
      ],
    },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'notes', type: 'textarea' },
    {
      name: 'timeline',
      type: 'array',
      labels: { singular: 'Timeline entry', plural: 'Timeline' },
      admin: { description: 'Comments and activity, newest appended last.' },
      fields: [
        {
          name: 'kind',
          type: 'select',
          defaultValue: 'event',
          options: [
            { label: 'Comment', value: 'comment' },
            { label: 'Event', value: 'event' },
            { label: 'Email', value: 'email' },
          ],
        },
        { name: 'text', type: 'text', required: true },
        { name: 'author', type: 'text' },
        { name: 'at', type: 'date' },
      ],
    }
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
