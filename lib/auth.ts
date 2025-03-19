import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "./dummy-data";

export const authOptions: NextAuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID || "",
    //   clientSecret: process.env.GITHUB_SECRET || "",
    // }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 简单的静态用户验证
        const user = users.find(user => user.email === credentials.email);
        
        // 在实际应用中，这里应该验证密码
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 