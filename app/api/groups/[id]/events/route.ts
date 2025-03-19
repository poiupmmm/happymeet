import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 获取小组活动列表
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming") === "true";
    const limit = parseInt(searchParams.get("limit") || "5");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // 检查小组是否存在
    const group = await prisma.group.findUnique({
      where: { id: params.id },
    });

    if (!group) {
      return NextResponse.json(
        { message: "小组不存在" },
        { status: 404 }
      );
    }

    // 构建查询条件
    const where: any = {
      groupId: params.id,
    };

    if (upcoming) {
      where.startTime = {
        gte: new Date(),
      };
    }

    // 获取小组活动
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
        orderBy: {
          startTime: upcoming ? "asc" : "desc",
        },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      events,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("获取小组活动错误:", error);
    return NextResponse.json(
      { message: "获取小组活动失败" },
      { status: 500 }
    );
  }
} 