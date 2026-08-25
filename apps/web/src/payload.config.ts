import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig } from 'payload';
import { Consultations } from './payload/collections/Consultations';
import { Customers } from './payload/collections/Customers';
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
  ? postgresAdapter({
      pool: { connectionString: process.env.DATABASE_URL },
      // Auto-sync the schema in NON-production only (Payload gates push on
      // NODE_ENV — see @payloadcms/drizzle connect.js). This builds the tables
      // when you run locally against Neon. In production Payload never pushes,
      // so the Neon schema must already exist (created by a local dev run, or
      // via prodMigrations).
      push: true,
    })
  : sqliteAdapter({ client: { url: `file:${path.resolve(dirname, '../moves-cms-dev.db')}` } });

// Supabase Storage (S3-compatible) — only enabled once keys are provided.
// Until then, uploads fall back to Payload's local disk so the CMS still works.
// Vercel's Blob integration injects the token under a store-prefixed name
// (moves_READ_WRITE_TOKEN); locally we use the standard BLOB_READ_WRITE_TOKEN.
// Accept either so no duplicate env var is needed.
const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.moves_READ_WRITE_TOKEN;

// Media storage, in priority order:
//   1. Vercel Blob  — when a blob token is set (the deployed default)
//   2. S3           — when S3_BUCKET is set
//   3. local disk   — dev fallback (does NOT persist on Vercel serverless)
const storagePlugins = blobToken
  ? [
      vercelBlobStorage({
        collections: { media: true },
        token: blobToken,
      }),
    ]
  : process.env.S3_BUCKET
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

/**
 * sharp powers Payload's image resizing.
 *
 * Its native binary fails to load on Vercel's serverless runtime under pnpm
 * (ERR_DLOPEN_FAILED: libvips-cpp.so is missing, because pnpm's symlinked
 * node_modules doesn't survive the function bundle). A static import made that
 * a hard crash on EVERY Payload route — /cms, /admin and /login all 500'd.
 *
 * Load it defensively instead: resizing is a nice-to-have, an admin that
 * doesn't boot is not. Locally (and anywhere the binary resolves) sharp is
 * used exactly as before; where it can't load, Payload runs without resizing
 * and uploads keep their original dimensions.
 */
let sharpModule: typeof import('sharp').default | undefined;
try {
  sharpModule = (await import('sharp')).default;
} catch (err) {
  console.warn(
    '[payload] sharp could not be loaded — image resizing is disabled.',
    err instanceof Error ? err.message : err,
  );
}

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
  collections: [Users, Media, Products, Orders, Consultations, Customers],
  globals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-ENV',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  sharp: sharpModule,
  plugins: [...storagePlugins],
});
