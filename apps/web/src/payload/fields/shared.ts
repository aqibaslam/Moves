import type { Field } from 'payload';

/** Small uppercase label shown above a section heading. */
export const eyebrowField = (defaultDesc = 'Small uppercase label above the heading.'): Field => ({
  name: 'eyebrow',
  type: 'text',
  admin: { description: defaultDesc },
});

/**
 * A two-tone heading: the `accent` part renders in coral, the `rest` in navy.
 * Matches the design's "Real moves. Signed." style headings.
 */
export const twoToneHeading = (label = 'Heading'): Field => ({
  name: 'heading',
  type: 'group',
  label,
  admin: { description: 'The coloured part renders in coral, the rest in navy.' },
  fields: [
    { name: 'accent', type: 'text', label: 'Coral part' },
    { name: 'rest', type: 'text', label: 'Navy part' },
  ],
});

/** A call-to-action button (label + link). */
export const buttonField = (name = 'button', label = 'Button'): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'label', type: 'text' },
    {
      name: 'href',
      type: 'text',
      admin: { description: 'Where it links — a URL or an on-page anchor like #cta.' },
    },
  ],
});

/** An image (or video) picked from the Media Library. */
export const mediaField = (name = 'image', label = 'Image', required = false): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
  label,
  required,
});

/** Plain body copy. */
export const bodyField = (name = 'body', label = 'Body text'): Field => ({
  name,
  type: 'textarea',
  label,
});
