import type { GlobalConfig } from 'payload';
import { buttonField, eyebrowField, mediaField, twoToneHeading } from '../fields/shared';

export const moversGlobal: GlobalConfig = {
  slug: 'movers',
  label: '12 · The Movers',
  admin: { group: 'Landing Page', description: 'The "You don\'t buy moves" membership tiers.' },
  access: { read: () => true },
  fields: [
    eyebrowField(),
    twoToneHeading(),
    { name: 'subtext', type: 'textarea', label: 'Sub-text' },
    buttonField('button', 'Button'),
    {
      name: 'tiers',
      type: 'array',
      label: 'Tiers',
      labels: { singular: 'Tier', plural: 'Tiers' },
      fields: [
        mediaField('icon', 'Icon'),
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
};
