import { NextResponse } from "next/server";
import { z } from "zod";

// 注册API路由 - 简化版本
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 简单的数据验证
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    });
    
    // 验证输入数据
    schema.parse(body);
    
    // 假设注册成功
    return NextResponse.json({ 
      message: "注册成功", 
      user: { 
        id: "demo-user-id", 
        name: body.name, 
        email: body.email 
      } 
    }, { status: 201 });
    
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json({ message: "注册失败" }, { status: 500 });
  }
} 