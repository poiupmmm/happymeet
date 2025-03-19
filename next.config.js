/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  output: 'standalone',
  // 实验性功能但对Vercel部署很重要
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"]
  }
};

module.exports = nextConfig;
