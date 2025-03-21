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
  webpack: (config, { isServer }) => {
    // 添加对node_modules的支持
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // 禁用严格模式，允许在客户端导入服务器组件
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
