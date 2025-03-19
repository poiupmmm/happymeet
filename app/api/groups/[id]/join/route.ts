import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 加入小组
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

    // 检查用户是否已经是成员
    const existingMember = await prisma.groupMember.findFirst({
      where: {
        groupId: params.id,
        userId: session.user.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { message: "您已经是该小组成员" },
        { status: 400 }
      );
    }

    // 创建成员关系
    const member = await prisma.groupMember.create({
      data: {
        groupId: params.id,
        userId: session.user.id,
        role: "MEMBER", // 默认角色为普通成员
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // TODO: 创建通知，告知小组管理员有新成员加入

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("加入小组错误:", error);
    return NextResponse.json(
      { message: "加入小组失败" },
      { status: 500 }
    );
  }
} 