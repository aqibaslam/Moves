import type { GlobalConfig } from 'payload';
import { eyebrowField, mediaField, twoToneHeading } from '../fields/shared';

export const pricingGlobal: GlobalConfig = {
  slug: 'pricing',
  label: '8 · Pricing',
  admin: { group: 'Landing Page', description: 'The "Exactly what Moves costs" plan cards.' },
  access: { read: () => true },
  fields: [
    eyebrowField(),
    twoToneHeading(),
    { name: 'subtext', type: 'textarea', label: 'Sub-text' },
    {
      name: 'plans',
      type: 'array',
      label: 'Plans',
      labels: { singular: 'Plan', plural: 'Plans' },
      maxRows: 2,
      fields: [
        { name: 'title', type: 'text' },
        { name: 'price', type: 'text', admin: { description: 'e.g. "£16.30"' } },
        { name: 'per', type: 'text', admin: { description: 'e.g. "/per month"' } },
        mediaField('productImage', 'Product image'),
        {
          name: 'features',
          type: 'array',
          labels: { singular: 'Feature', plural: 'Features' },
          fields: [{ name: 'text', type: 'text' }],
        },
        { name: 'buttonLabel', type: 'text' },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'navy',
          options: [
            { label: 'Pink card / coral button', value: 'pink' },
            { label: 'Light card / navy button', value: 'navy' },
          ],
        },
      ],
    },
  ],
};
