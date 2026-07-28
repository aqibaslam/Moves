import type { GlobalConfig } from 'payload';
import { buttonField, mediaField } from '../fields/shared';

export const ctaGlobal: GlobalConfig = {
  slug: 'cta',
  label: '13 · "Your MOVE" Banner',
  admin: { group: 'Landing Page', description: 'The full-bleed call-to-action banner + guarantee badge.' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtext', type: 'textarea', label: 'Sub-text' },
    buttonField('button', 'Button'),
    mediaField('backgroundImage', 'Background image'),
    {
      name: 'badge',
      type: 'group',
      label: 'Guarantee badge',
      fields: [
        { name: 'topLabel', type: 'text', admin: { description: 'e.g. "Money back"' } },
        { name: 'midLabel', type: 'text', admin: { description: 'e.g. "Guarantee"' } },
        { name: 'bigNumber', type: 'text', admin: { description: 'e.g. "30"' } },
        { name: 'bottomLabel', type: 'text', admin: { description: 'e.g. "days"' } },
      ],
    },
  ],
};
