import type { GlobalConfig } from 'payload';
import { buttonField, eyebrowField, mediaField } from '../fields/shared';

export const manifestoGlobal: GlobalConfig = {
  slug: 'manifesto',
  label: '4 · Brand Manifesto (coral)',
  admin: { group: 'Landing Page', description: 'The coral statement section with the laughing portrait.' },
  access: { read: () => true },
  fields: [
    eyebrowField(),
    {
      name: 'heading',
      type: 'group',
      label: 'Heading',
      admin: { description: 'The bright part shows solid white; the dim part is faded.' },
      fields: [
        { name: 'bright', type: 'text', label: 'Bright (white) part' },
        { name: 'dim', type: 'textarea', label: 'Dim (faded) part' },
      ],
    },
    { name: 'subtext', type: 'textarea', label: 'Sub-text' },
    buttonField('button', 'Button'),
    mediaField('backgroundImage', 'Background image'),
    mediaField('portrait', 'Portrait image'),
  ],
};
