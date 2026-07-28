import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Team Member', plural: 'Team & Access' },
  auth: true,
  admin: {
    useAsTitle: 'name',
    group: 'Settings',
    description: 'People who can sign in and edit the Moves site.',
    defaultColumns: ['name', 'email'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: { description: 'Shown in the admin bar and on activity.' },
    },
  ],
};
