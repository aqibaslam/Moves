import type { GlobalConfig } from 'payload';
import { bodyField, eyebrowField, mediaField, twoToneHeading } from '../fields/shared';

export const problemGlobal: GlobalConfig = {
  slug: 'problem',
  label: '3 · The Moves You Already Make',
  admin: { group: 'Landing Page', description: 'Hover-to-swap list of "wrong moves" with images.' },
  access: { read: () => true },
  fields: [
    eyebrowField(),
    twoToneHeading(),
    {
      name: 'items',
      type: 'array',
      label: 'List items',
      labels: { singular: 'Move', plural: 'Moves' },
      admin: { description: 'Each item highlights and swaps the image on hover.' },
      fields: [
        { name: 'text', type: 'text' },
        mediaField('image', 'Slide image'),
      ],
    },
    bodyField('note', 'Closing line'),
  ],
};
