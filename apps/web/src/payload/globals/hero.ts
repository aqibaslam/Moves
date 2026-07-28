import type { GlobalConfig } from 'payload';
import { buttonField, mediaField } from '../fields/shared';

export const heroGlobal: GlobalConfig = {
  slug: 'hero',
  label: '2 · Hero',
  admin: { group: 'Landing Page', description: 'The pink hero: rating, headline, CTA and portrait.' },
  access: { read: () => true },
  fields: [
    { name: 'ratingCount', type: 'text', label: 'Trustpilot label', admin: { description: 'e.g. "Excellent (3,890)"' } },
    {
      name: 'headline',
      type: 'group',
      label: 'Headline',
      admin: { description: 'The coral part + the rest.' },
      fields: [
        { name: 'accent', type: 'text', label: 'Coral part' },
        { name: 'rest', type: 'text', label: 'Navy part' },
      ],
    },
    { name: 'subhead', type: 'textarea', label: 'Sub-headline' },
    buttonField('primaryButton', 'Primary button'),
    { name: 'secondaryLinkLabel', type: 'text', label: 'Secondary link label' },
    mediaField('heroImage', 'Hero image'),
    {
      name: 'signature',
      type: 'group',
      label: 'Signature card',
      fields: [
        { name: 'name', type: 'text', admin: { description: 'Handwritten name, e.g. "Amelia Hart".' } },
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
      ],
    },
  ],
};
