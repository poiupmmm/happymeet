import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 获取当前用户所在的小组列表
export async function GET(request: Request) {
  try {
    const session = await auth();

    // 检查是否已登录
    if (!session) {
      return NextResponse.json(
        { message: "未授权" },
        { status: 401 }
      );
    }

    // 获取用户所在的小组列表（包括作为成员和作为创建者的小组）
    const userGroups = await prisma.group.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
          {
            creatorId: session.user.id,
          },
        ],
      },
      include: {
        _count: {
          select: {
            members: true,
            events: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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