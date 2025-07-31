/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // For Netlify static hosting
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

module.exports = nextConfig;
