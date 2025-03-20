import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth/next";

// 创建NextAuth处理程序
const handler = NextAuth(authOptions);

// 导出auth函数以供其他API路由使用
export const auth = () => getServerSession(authOptions);

// 导出GET和POST处理函数
export { handler as GET, handler as POST }; 