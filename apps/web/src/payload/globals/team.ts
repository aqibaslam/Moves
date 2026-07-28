import type { GlobalConfig } from 'payload';
import { buttonField, eyebrowField, mediaField, twoToneHeading } from '../fields/shared';

export const teamGlobal: GlobalConfig = {
  slug: 'team',
  label: '10 · Team',
  admin: { group: 'Landing Page', description: 'The "Names behind the smiles" dentist cards.' },
  access: { read: () => true },
  fields: [
    eyebrowField(),
    twoToneHeading(),
    { name: 'subtext', type: 'textarea', label: 'Sub-text' },
    buttonField('button', 'Button'),
    {
      name: 'members',
      type: 'array',
      label: 'Dentists',
      labels: { singular: 'Dentist', plural: 'Dentists' },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'role', type: 'text', admin: { description: 'e.g. "Moves Verified Dentist"' } },
        { name: 'gdc', type: 'text', admin: { description: 'e.g. "GDC No. 12345"' } },
        mediaField('photo', 'Photo'),
      ],
    },
  ],
};
