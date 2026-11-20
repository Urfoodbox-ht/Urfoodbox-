import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

export default function nextConfig(phase: string): NextConfig {
  const isVercel = Boolean(process.env.VERCEL);
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    ...(isDevServer ? { distDir: '.next-dev' } : {}),
    ...(isVercel || isDevServer ? {} : { output: 'standalone' as const }),
    images: {
      unoptimized: true,
    },
    transpilePackages: ['firebase-admin'],
    serverExternalPackages: ['pg'],
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate',
            },
          ],
        },
      ];
    },
  };
}
