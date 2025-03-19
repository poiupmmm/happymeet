/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    middleware: {
      // 设置为nodejs运行时
      runtime: "nodejs"
    }
  }
};

module.exports = nextConfig;
