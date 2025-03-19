import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 加入活动
export async function POST(
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

    const userId = session.user.id;
    const eventId = params.id;

    // 检查活动是否存在
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: "活动不存在" },
        { status: 404 }
      );
    }

    // 检查用户是否已经是活动成员
    const existingMember = await prisma.eventMember.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { message: "您已经加入了此活动" },
        { status: 400 }
      );
    }

    // 检查活动是否已满员
    if (event.maxMembers > 0 && event._count.members >= event.maxMembers) {
      return NextResponse.json(
        { message: "活动已满员" },
        { status: 400 }
      );
    }

    // 检查活动是否已经开始
    const now = new Date();
    if (event.startTime <= now) {
      return NextResponse.json(
        { message: "活动已经开始，无法加入" },
        { status: 400 }
      );
    }

    // 添加用户为活动成员
    const newMember = await prisma.eventMember.create({
      data: {
        userId,
        eventId,
        joinedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(newMember);
  } catch (error) {
    console.error("加入活动错误:", error);
    return NextResponse.json(
      { message: "加入活动失败" },
      { status: 500 }
    );
  }
}

// 退出活动
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

    const userId = session.user.id;
    const eventId = params.id;

    // 检查活动是否存在
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { message: "活动不存在" },
        { status: 404 }
      );
    }

    // 检查用户是否是活动成员
    const member = await prisma.eventMember.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: "您不是此活动的成员" },
        { status: 400 }
      );
    }

    // 活动创建者不能退出自己的活动
    if (event.creatorId === userId) {
      return NextResponse.json(
        { message: "活动创建者不能退出自己的活动" },
        { status: 400 }
      );
    }

    // 检查活动是否已经开始
    const now = new Date();
    if (event.startTime <= now) {
      return NextResponse.json(
        { message: "活动已经开始，无法退出" },
        { status: 400 }
      );
    }

    // 移除用户的活动成员资格
    await prisma.eventMember.delete({
      where: {
        id: member.id,
      },
    });

    return NextResponse.json(
      { message: "已成功退出活动" },
      { status: 200 }
    );
  } catch (error) {
    console.error("退出活动错误:", error);
    return NextResponse.json(
      { message: "退出活动失败" },
      { status: 500 }
    );
  }
} 