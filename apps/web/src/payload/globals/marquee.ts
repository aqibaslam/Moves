import type { GlobalConfig } from 'payload';

export const marqueeGlobal: GlobalConfig = {
  slug: 'marquee',
  label: '5 · Marquee Strip',
  admin: { group: 'Landing Page', description: 'The scrolling row of phrases.' },
  access: { read: () => true },
  fields: [
    {
      name: 'words',
      type: 'array',
      label: 'Phrases',
      labels: { singular: 'Phrase', plural: 'Phrases' },
      fields: [{ name: 'text', type: 'text' }],
    },
  ],
};
