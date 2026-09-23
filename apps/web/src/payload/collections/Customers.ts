import type { CollectionConfig } from 'payload';

/**
 * People who place orders. Kept separate from `users` (staff logins) — a
 * customer never signs in. Created from the order builder or the storefront
 * checkout, and reusable across orders.
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: { singular: 'Customer', plural: 'Customers' },
  admin: {
    group: 'Store',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'phone', type: 'text' },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'postcode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'United Kingdom' },
      ],
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Email confirmed via the one-time link.' },
    },
    {
      name: 'signupSource',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Email link', value: 'email' },
        { label: 'Google', value: 'google' },
        { label: 'Order', value: 'order' },
        { label: 'Added by staff', value: 'manual' },
      ],
    },
    // one-time sign-up link (cleared once used)
    { name: 'signupToken', type: 'text', index: true, admin: { hidden: true } },
    { name: 'signupTokenExpiry', type: 'date', admin: { hidden: true } },
  ],
};
