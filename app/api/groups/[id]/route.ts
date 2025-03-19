import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 获取小组详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const group = await prisma.group.findUnique({
      where: { id: params.id },
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
            events: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { message: "小组不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("获取小组详情错误:", error);
    return NextResponse.json(
      { message: "获取小组详情失败" },
      { status: 500 }
    );
  }
}

// 更新小组信息
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

    // 获取小组信息
    const group = await prisma.group.findUnique({
      where: { id: params.id },
      include: {
        members: {
          where: {
            userId: session.user.id,
            role: "ADMIN",
          },
        },
      },
    });

    // 检查是否有权限更新（只有管理员可以更新）
    if (!group || group.members.length === 0) {
      return NextResponse.json(
        { message: "无权更新此小组" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, category, location, latitude, longitude } = body;

    // 验证输入
    if (!name || !description || !category || !location) {
      return NextResponse.json(
        { message: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    // 更新小组信息
    const updatedGroup = await prisma.group.update({
      where: { id: params.id },
      data: {
        name,
        description,
        category,
        location,
        latitude: parseFloat(latitude) || group.latitude,
        longitude: parseFloat(longitude) || group.longitude,
      },
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("更新小组错误:", error);
    return NextResponse.json(
      { message: "更新小组失败" },
      { status: 500 }
    );
  }
}

// 删除小组
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

    // 获取小组信息
    const group = await prisma.group.findUnique({
      where: { id: params.id },
      include: {
        members: {
          where: {
            userId: session.user.id,
            role: "ADMIN",
          },
        },
      },
    });

    // 检查是否有权限删除（只有管理员可以删除）
    if (!group || group.members.length === 0) {
      return NextResponse.json(
        { message: "无权删除此小组" },
        { status: 403 }
      );
    }

    // 删除小组（这里先删除相关的所有记录，然后删除小组本身）
    await prisma.$transaction([
      prisma.groupMember.deleteMany({
        where: { groupId: params.id },
      }),
      prisma.event.deleteMany({
        where: { groupId: params.id },
      }),
      prisma.message.deleteMany({
        where: { groupId: params.id },
      }),
      prisma.group.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json(
      { message: "小组已删除" },
      { status: 200 }
    );
  } catch (error) {
    console.error("删除小组错误:", error);
    return NextResponse.json(
      { message: "删除小组失败" },
      { status: 500 }
    );
  }
} 