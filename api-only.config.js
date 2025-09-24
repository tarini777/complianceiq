/** @type {import('next').NextConfig} */
const nextConfig = {
  // API-only configuration
  output: 'standalone',
  
  // Disable static optimization for API routes
  experimental: {
    outputFileTracingRoot: undefined,
  },
  
  // Redirect all non-API routes to API documentation
  async redirects() {
    return [
      {
        source: '/',
        destination: '/api/docs',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/api/docs',
        permanent: false,
      },
      {
        source: '/assessment',
        destination: '/api/docs',
        permanent: false,
      },
      {
        source: '/askrexi',
        destination: '/api/docs',
        permanent: false,
      },
      {
        source: '/analytics',
        destination: '/api/docs',
        permanent: false,
      },
      {
        source: '/regulatory',
        destination: '/api/docs',
        permanent: false,
      },
    ];
  },
  
  // Environment variables for API-only mode
  env: {
    API_ONLY_MODE: 'true',
    DISABLE_UI: 'true',
  },
  
  // Headers for API responses
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-API-Key',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
          {
            key: 'X-API-Version',
            value: '1.0',
          },
          {
            key: 'X-API-Mode',
            value: 'API-Only',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
