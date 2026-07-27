import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Without this Next walks up and finds C:\Users\DELL\package-lock.json,
  // guessing the wrong workspace root.
  turbopack: {
    root: path.join(__dirname, '../..'),
  },

  // Workspace packages ship raw TS — Next must compile them.
  transpilePackages: ['@moves/ui', '@moves/design-tokens', '@moves/supabase-client'],

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Promoted out of `experimental` in Next 16.
  typedRoutes: true,
};

export default nextConfig;
