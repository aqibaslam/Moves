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

  // The webpack build ignores `turbopack.root`. Without this, output file
  // tracing roots at apps/web and misses the pnpm monorepo's dependencies in
  // the root node_modules/.pnpm store — so on Vercel the serverless bundle
  // lacks Payload's modules and every CMS route (getPayload) 500s at runtime,
  // even though the build passes and `next start` works locally. Point tracing
  // at the monorepo root, the same as turbopack.root.
  outputFileTracingRoot: path.join(dirname, '../..'),

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

  // Home page: serve the funnel-2026 page at the root URL (movesuk.com/) while
  // keeping the clean "/" path. `beforeFiles` runs before the filesystem route,
  // so it overrides the existing app/(frontend)/page.tsx at "/".
  async rewrites() {
    return {
      beforeFiles: [{ source: '/', destination: '/funnel-2026' }],
      afterFiles: [],
      fallback: [],
    };
  },

};

export default withPayload(nextConfig, { devBundleServerPackages: false });
