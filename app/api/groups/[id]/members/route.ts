import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 获取小组成员列表
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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

    // 获取小组成员
    const members = await prisma.groupMember.findMany({
      where: { groupId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [
        { role: "asc" }, // ADMIN排在前面
        { joinedAt: "asc" }, // 然后按加入时间排序
      ],
    });

    return NextResponse.json({
      members,
      count: members.length,
    });
  } catch (error) {
    console.error("获取小组成员错误:", error);
    return NextResponse.json(
      { message: "获取小组成员失败" },
      { status: 500 }
    );
  }
}

// 更新成员角色（只有管理员可以操作）
export async function PATCH(
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

    // 检查当前用户是否是小组管理员
    const adminMember = await prisma.groupMember.findFirst({
      where: {
        groupId: params.id,
        userId: session.user.id,
        role: "ADMIN",
      },
    });

    if (!adminMember) {
      return NextResponse.json(
        { message: "无权执行此操作" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { message: "缺少必要参数" },
        { status: 400 }
      );
    }

    // 检查要更新的成员是否存在
    const targetMember = await prisma.groupMember.findFirst({
      where: {
        groupId: params.id,
        userId,
      },
    });

    if (!targetMember) {
      return NextResponse.json(
        { message: "该成员不存在" },
        { status: 404 }
      );
    }

    // 不能修改自己的角色
    if (targetMember.userId === session.user.id) {
      return NextResponse.json(
        { message: "不能修改自己的角色" },
        { status: 400 }
      );
    }

    // 更新成员角色
    const updatedMember = await prisma.groupMember.update({
      where: {
        id: targetMember.id,
      },
      data: {
        role,
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
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("更新成员角色错误:", error);
    return NextResponse.json(
      { message: "更新成员角色失败" },
      { status: 500 }
    );
  }
}

// 移除成员（只有管理员可以操作）
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    // 检查是否已登录
    if (!session) {
      return NextResponse.json(
        { message: "未授权" },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "缺少用户ID参数" },
        { status: 400 }
      );
    }

    // 检查是否是自己离开小组
    const isSelfLeaving = userId === session.user.id;

    if (!isSelfLeaving) {
      // 不是自己离开，检查当前用户是否是管理员
      const adminMember = await prisma.groupMember.findFirst({
        where: {
          groupId: params.id,
          userId: session.user.id,
          role: "ADMIN",
        },
      });

      if (!adminMember) {
        return NextResponse.json(
          { message: "无权执行此操作" },
          { status: 403 }
        );
      }

      // 检查要移除的是否是另一个管理员
      const targetMember = await prisma.groupMember.findFirst({
        where: {
          groupId: params.id,
          userId,
        },
      });

      if (targetMember?.role === "ADMIN") {
        return NextResponse.json(
          { message: "不能移除管理员" },
          { status: 400 }
        );
      }
    }

    // 移除成员
    await prisma.groupMember.deleteMany({
      where: {
        groupId: params.id,
        userId,
      },
    });

    return NextResponse.json(
      { message: isSelfLeaving ? "已离开小组" : "已移除成员" },
      { status: 200 }
    );
  } catch (error) {
    console.error("移除成员错误:", error);
    return NextResponse.json(
      { message: "移除成员失败" },
      { status: 500 }
    );
  }
} 