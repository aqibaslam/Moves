import type { GlobalConfig } from 'payload';
import { mediaField } from '../fields/shared';

export const footerGlobal: GlobalConfig = {
  slug: 'footer',
  label: '15 · Footer',
  admin: { group: 'Landing Page', description: 'Footer links, socials, mailing list and wordmark.' },
  access: { read: () => true },
  fields: [
    {
      name: 'navLinks',
      type: 'array',
      label: 'Footer links',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social links',
      labels: { singular: 'Social', plural: 'Socials' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Email', value: 'email' },
          ],
        },
        { name: 'href', type: 'text' },
      ],
    },
    { name: 'mailingLabel', type: 'text', label: 'Mailing-list label' },
    { name: 'emailPlaceholder', type: 'text', label: 'Email field placeholder' },
    mediaField('wordmark', 'Wordmark logo'),
    { name: 'copyright', type: 'text' },
  ],
};
