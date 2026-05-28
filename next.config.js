/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  experimental: {
    // Add experimental features as needed
  },
};

module.exports = nextConfig;
