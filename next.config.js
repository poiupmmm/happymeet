/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'randomuser.me'],
  },
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
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
