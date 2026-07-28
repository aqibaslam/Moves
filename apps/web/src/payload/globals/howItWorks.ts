import type { GlobalConfig } from 'payload';
import { buttonField, eyebrowField, mediaField, twoToneHeading } from '../fields/shared';

export const howItWorksGlobal: GlobalConfig = {
  slug: 'how-it-works',
  label: '6 · How It Works',
  admin: { group: 'Landing Page', description: 'The three-step "You move, in three moves" cards.' },
  access: { read: () => true },
  fields: [
    eyebrowField(),
    twoToneHeading(),
    { name: 'subtext', type: 'textarea', label: 'Sub-text' },
    buttonField('button', 'Button'),
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      labels: { singular: 'Step', plural: 'Steps' },
      maxRows: 3,
      fields: [
        { name: 'stepLabel', type: 'text', label: 'Step label', admin: { description: 'e.g. "STEP 01"' } },
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
        mediaField('image', 'Image'),
        mediaField('imageOverlay', 'Overlay image (optional)'),
      ],
    },
  ],
};
