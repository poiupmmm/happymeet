/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'randomuser.me'],
  },
  output: 'standalone',
  // 实验性功能但对Vercel部署很重要
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"]
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
