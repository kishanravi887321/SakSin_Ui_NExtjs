import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'saksin.online',
          },
        ],
        permanent: true,
        destination: 'https://saksin.online/:path*',
      },
    ];
  },
}

const pwaConfig = withPWA({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
  scope: '/',
  sw: 'sw.js',
  publicExcludes: ['!noprecache/**/*'],
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

export default pwaConfig(nextConfig);
