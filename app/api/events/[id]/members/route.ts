import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 获取活动成员列表
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    // 检查活动是否存在
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return NextResponse.json(
        { message: "活动不存在" },
        { status: 404 }
      );
    }

    // 获取成员列表
    const [members, total] = await Promise.all([
      prisma.eventMember.findMany({
        where: { eventId: params.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { joinedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.eventMember.count({
        where: { eventId: params.id },
      }),
    ]);

    return NextResponse.json({
      members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取活动成员错误:", error);
    return NextResponse.json(
      { message: "获取活动成员失败" },
      { status: 500 }
    );
  }
}

// 移除活动成员
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // 检查是否已登录
    if (!session) {
      return NextResponse.json(
        { message: "未授权" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json(
        { message: "请指定要移除的成员" },
        { status: 400 }
      );
    }

    // 检查活动是否存在
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return NextResponse.json(
        { message: "活动不存在" },
        { status: 404 }
      );
    }

    // 检查是否有权限移除成员（只有活动创建者可以移除成员）
    if (event.creatorId !== session.user.id) {
      return NextResponse.json(
        { message: "无权移除活动成员" },
        { status: 403 }
      );
    }

    // 检查要移除的成员是否存在
    const member = await prisma.eventMember.findFirst({
      where: {
        id: memberId,
        eventId: params.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: "成员不存在" },
        { status: 404 }
      );
    }

    // 不能移除活动创建者
    if (member.userId === event.creatorId) {
      return NextResponse.json(
        { message: "不能移除活动创建者" },
        { status: 400 }
      );
    }

    // 移除成员
    await prisma.eventMember.delete({
      where: { id: memberId },
    });

    return NextResponse.json(
      { message: "成员已移除" },
      { status: 200 }
    );
  } catch (error) {
    console.error("移除活动成员错误:", error);
    return NextResponse.json(
      { message: "移除活动成员失败" },
      { status: 500 }
    );
  }
} 