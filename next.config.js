/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'randomuser.me'],
  },
  output: 'standalone',
  typescript: {
    // !! 仅用于演示，生产环境不推荐
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! 仅用于演示，生产环境不推荐
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
