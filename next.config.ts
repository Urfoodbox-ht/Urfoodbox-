import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pg', 'firebase-admin', 'bcryptjs'],
};

export default nextConfig;
