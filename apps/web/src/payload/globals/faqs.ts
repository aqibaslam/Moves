import type { GlobalConfig } from 'payload';
import { eyebrowField, twoToneHeading } from '../fields/shared';

export const faqsGlobal: GlobalConfig = {
  slug: 'faqs',
  label: '14 · FAQs',
  admin: { group: 'Landing Page', description: 'The accordion of frequently asked questions.' },
  access: { read: () => true },
  fields: [
    eyebrowField(),
    twoToneHeading(),
    {
      name: 'items',
      type: 'array',
      label: 'Questions',
      labels: { singular: 'Question', plural: 'Questions' },
      fields: [
        { name: 'question', type: 'text' },
        { name: 'answer', type: 'textarea' },
      ],
    },
  ],
};
