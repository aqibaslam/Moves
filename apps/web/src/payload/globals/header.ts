import type { GlobalConfig } from 'payload';
import { mediaField } from '../fields/shared';

export const headerGlobal: GlobalConfig = {
  slug: 'header',
  label: '1 · Header (bar + nav)',
  admin: {
    group: 'Landing Page',
    description: 'The top announcement bar and the navigation. Mobile shows different copy.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'collapsible',
      label: 'Announcement bar',
      fields: [
        { name: 'announcementNote', type: 'text', label: 'Message (desktop)' },
        { name: 'announcementLink', type: 'text', label: 'Link text (desktop)' },
        {
          name: 'announcementMobile',
          type: 'text',
          label: 'Message (mobile)',
          admin: { description: 'Shown instead of the desktop message on small screens.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Navigation',
      fields: [
        mediaField('logo', 'Logo'),
        {
          name: 'navLinks',
          type: 'array',
          label: 'Menu links',
          labels: { singular: 'Link', plural: 'Links' },
          admin: { description: 'Shown on desktop; collapse into the mobile menu button.' },
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href', type: 'text' },
          ],
        },
        {
          name: 'button',
          type: 'group',
          label: 'Nav button',
          fields: [
            { name: 'label', type: 'text', label: 'Label (desktop)' },
            {
              name: 'labelMobile',
              type: 'text',
              label: 'Label (mobile)',
              admin: { description: 'Shorter label for small screens, e.g. "Consultation".' },
            },
            { name: 'href', type: 'text' },
          ],
        },
        {
          name: 'showCart',
          type: 'checkbox',
          label: 'Show cart icon on mobile',
          defaultValue: true,
        },
      ],
    },
  ],
};
