import type { GlobalConfig } from 'payload';
import { eyebrowField, mediaField } from '../fields/shared';

export const proofGlobal: GlobalConfig = {
  slug: 'proof',
  label: '11 · Proof In Motion',
  admin: { group: 'Landing Page', description: 'The "Real smiles, real stories" video tiles.' },
  access: { read: () => true },
  fields: [
    eyebrowField(),
    {
      name: 'heading',
      type: 'group',
      label: 'Heading',
      admin: { description: 'Coral part + navy part (this heading starts coral).' },
      fields: [
        { name: 'accent', type: 'text', label: 'Coral part' },
        { name: 'rest', type: 'text', label: 'Navy part' },
      ],
    },
    { name: 'subtext', type: 'textarea', label: 'Sub-text' },
    {
      name: 'videos',
      type: 'array',
      label: 'Video tiles',
      labels: { singular: 'Video', plural: 'Videos' },
      fields: [
        mediaField('thumbnail', 'Thumbnail / poster'),
        mediaField('video', 'Video file (optional)'),
        { name: 'videoUrl', type: 'text', label: 'Video URL (optional)', admin: { description: 'External link (YouTube/Vimeo) if not uploading a file.' } },
      ],
    },
  ],
};
