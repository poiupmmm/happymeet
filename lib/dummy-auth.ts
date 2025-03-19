import { users } from './dummy-data';

// 简单的登录验证
export async function login(email: string, password: string) {
  const user = users.find(user => user.email === email);
  
  // 假设所有用户的密码都是"password"
  if (user && password === "password") {
    return { success: true, user };
  }
  
  return { success: false, message: "Invalid credentials" };
} 