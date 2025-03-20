import { PrismaClient } from "@prisma/client";

// 使用单例模式确保在应用生命周期中只创建一个PrismaClient实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 使用条件初始化PrismaClient，防止热重载时创建多个实例
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 在开发环境中将prisma实例保存到全局对象中
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 导出实例
export default prisma; 