import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: "public",
  cacheOnFrontEndNav: process.env.NODE_ENV === 'production',
  fallbacks: {
    image: '/android-chrome-512x512.png',
    font: '',
    audio: '',
    video: ''
  },
  cacheStartUrl: true,
  skipWaiting: true,
  scope: '/',
  sw: '/sw.js',
  cacheId: 'para-po',
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  navigationPreload: true,
  maximumFileSizeToCacheInBytes: 5_000_000,
  dynamicStartUrl: true,
  disable: process.env.NODE_ENV === 'development',
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    domains: [
      'lh3.googleusercontent.com'  // Add Google Photos domain
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    appDocumentPreloading: true,
    memoryBasedWorkersCount: true,
    optimisticClientCache: true,
    optimizePackageImports: ["@shadcn/ui", "react-icons", "next-auth", "@prisma/client"],
    scrollRestoration: true,
  },
  async headers () {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default pwaConfig(nextConfig);