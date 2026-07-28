import type { GlobalConfig } from 'payload';
import { eyebrowField, mediaField, twoToneHeading } from '../fields/shared';

export const beforeAftersGlobal: GlobalConfig = {
  slug: 'before-afters',
  label: '7 · Before & Afters',
  admin: { group: 'Landing Page', description: 'The "Real moves. Signed." case-study slider.' },
  access: { read: () => true },
  fields: [
    eyebrowField(),
    twoToneHeading(),
    { name: 'subtext', type: 'textarea', label: 'Sub-text' },
    {
      name: 'cards',
      type: 'array',
      label: 'Case studies',
      labels: { singular: 'Case', plural: 'Cases' },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'quote', type: 'textarea' },
        { name: 'signedBy', type: 'text', label: 'Signed by' },
        { name: 'gdc', type: 'text', label: 'GDC number', admin: { description: 'e.g. "GDC: 251837"' } },
        mediaField('beforeImage', 'Before image'),
        mediaField('afterImage', 'After image'),
      ],
    },
  ],
};
