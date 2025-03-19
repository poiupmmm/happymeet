/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    middleware: {
      // ����Ϊnodejs����ʱ
      runtime: "nodejs"
    }
  }
};

module.exports = nextConfig;
