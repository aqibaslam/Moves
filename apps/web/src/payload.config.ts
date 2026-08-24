import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { Consultations } from './payload/collections/Consultations';
import { Media } from './payload/collections/Media';
import { Orders } from './payload/collections/Orders';
import { Products } from './payload/collections/Products';
import { Users } from './payload/collections/Users';
import { globals } from './payload/globals';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Database: Supabase Postgres in production (once DATABASE_URL is set), and a
// zero-setup local SQLite file for development so the admin runs immediately.
const db = process.env.DATABASE_URL
  ? postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } })
  : sqliteAdapter({ client: { url: `file:${path.resolve(dirname, '../moves-cms-dev.db')}` } });

// Supabase Storage (S3-compatible) — only enabled once keys are provided.
// Until then, uploads fall back to Payload's local disk so the CMS still works.
const storagePlugins = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: { media: { prefix: 'media' } },
        bucket: process.env.S3_BUCKET,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION || 'us-east-1',
          forcePathStyle: true, // required for Supabase Storage
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
        },
      }),
    ]
  : [];

export default buildConfig({
  // Admin UI lives at /cms — the custom staff dashboard owns /admin.
  routes: { admin: '/cms' },
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · Moves CMS',
      description: 'Edit every section, image and video on the Moves landing page.',
    },
  },
  collections: [Users, Media, Products, Orders, Consultations],
  globals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-ENV',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  sharp,
  plugins: [...storagePlugins],
});
