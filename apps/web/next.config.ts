import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

// ESM: __dirname isn't available (package is "type": "module").
const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Without this Next walks up and finds C:\Users\DELL\package-lock.json,
  // guessing the wrong workspace root.
  turbopack: {
    root: path.join(dirname, '../..'),
  },

  // Workspace packages ship raw TS — Next must compile them.
  transpilePackages: ['@moves/ui', '@moves/design-tokens', '@moves/supabase-client'],

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/**',
      },
    ],
  },

  // Product saves post their images through a Server Action; the default
  // 1 MB request cap rejects anything with a real photo (HTTP 413). Raise it
  // so multi-image products save.
  experimental: {
    serverActions: { bodySizeLimit: '25mb' },
  },

  // Promoted out of `experimental` in Next 16.
  typedRoutes: true,

};

export default withPayload(nextConfig, { devBundleServerPackages: false });
