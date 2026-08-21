import type { CollectionConfig } from 'payload';

export const CONSULTATION_STATUSES = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'No show', value: 'no_show' },
  { label: 'Cancelled', value: 'cancelled' },
] as const;

/**
 * Consultations booked through the site. `create` is open so the public
 * booking wizard can write one without a session; reading them requires auth.
 */
export const Consultations: CollectionConfig = {
  slug: 'consultations',
  labels: { singular: 'Consultation', plural: 'Consultations' },
  admin: {
    group: 'Store',
    useAsTitle: 'patientName',
    description: 'Consultations booked through the website.',
    defaultColumns: ['patientName', 'scheduledFor', 'clinic', 'status'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'patientName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'scheduledFor',
      type: 'date',
      required: true,
      index: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'clinic', type: 'text' },
    { name: 'dentist', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      options: [...CONSULTATION_STATUSES],
      index: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'Where the booking came from — Website, Instagram, Referral…' },
    },
    { name: 'notes', type: 'textarea' },
  ],
};
