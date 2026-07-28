import type { GlobalConfig } from 'payload';
import { twoToneHeading } from '../fields/shared';

export const reviewsGlobal: GlobalConfig = {
  slug: 'reviews',
  label: '9 · Trustpilot Reviews',
  admin: { group: 'Landing Page', description: 'The "Don\'t take our word for it" review wall.' },
  access: { read: () => true },
  fields: [
    { name: 'ratingCount', type: 'text', label: 'Trustpilot label', admin: { description: 'e.g. "Excellent (3,890)"' } },
    twoToneHeading(),
    { name: 'viewMoreLabel', type: 'text', label: '"View more" button label' },
    {
      name: 'reviews',
      type: 'array',
      label: 'Reviews',
      labels: { singular: 'Review', plural: 'Reviews' },
      fields: [
        { name: 'author', type: 'text' },
        { name: 'timeAgo', type: 'text', admin: { description: 'e.g. "5 hours ago"' } },
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
};
