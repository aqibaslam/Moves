import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CollectionConfig } from 'payload';

const dirname = path.dirname(fileURLToPath(import.meta.url));
// Local uploads (when Supabase Storage isn't configured) land in Next's public
// dir and are served at /media/<file>. The S3 plugin overrides this when active.
const staticDir = path.resolve(dirname, '../../../public/media');

/**
 * Every image and video used on the landing page lives here.
 * Storage is Supabase (S3-compatible) via the storage-s3 plugin in the config;
 * this collection just defines the record shape + responsive sizes.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media Library' },
  admin: {
    group: 'Library',
    description: 'Upload and manage all photos and videos for the site.',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir,
    mimeTypes: ['image/*', 'video/*'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: undefined },
      { name: 'card', width: 800, height: undefined },
      { name: 'wide', width: 1600, height: undefined },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text',
      admin: {
        description: 'Describe the image for screen readers and SEO. Leave blank for purely decorative images.',
      },
    },
  ],
};
