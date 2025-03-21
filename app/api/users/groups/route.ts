import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// 添加配置表明这是一个动态路由
export const dynamic = 'force-dynamic';

// 获取当前用户所在的小组列表
export async function GET() {
  try {
    // 模拟数据返回，避免在构建时调用数据库
    const userGroups = [
      {
        id: '1',
        name: '户外探险俱乐部',
        description: '喜欢户外活动的朋友们的聚集地',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { members: 24, events: 5 }
      },
      {
        id: '2',
        name: '读书会',
        description: '每周共读一本书，分享感想',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { members: 18, events: 3 }
      }
    ];

    return NextResponse.json({
      groups: userGroups,
      count: userGroups.length,
    });
  } catch (error) {
    console.error("获取用户小组错误:", error);
    return NextResponse.json(
      { message: "获取用户小组失败" },
      { status: 500 }
    );
  }
} 