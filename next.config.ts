import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pg', 'firebase-admin', 'bcryptjs'],
};

export default nextConfig;
