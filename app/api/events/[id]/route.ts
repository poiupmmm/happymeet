import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 获取活动详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            comments: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: "活动不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("获取活动详情错误:", error);
    return NextResponse.json(
      { message: "获取活动详情失败" },
      { status: 500 }
    );
  }
}

// 更新活动信息
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

    // 获取活动信息
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    // 检查活动是否存在
    if (!event) {
      return NextResponse.json(
        { message: "活动不存在" },
        { status: 404 }
      );
    }

    // 检查是否有权限更新（只有创建者可以更新）
    if (event.creatorId !== session.user.id) {
      return NextResponse.json(
        { message: "无权更新此活动" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      latitude,
      longitude,
      maxMembers,
      price,
    } = body;

    // 验证必填字段
    if (
      !title ||
      !description ||
      !startTime ||
      !endTime ||
      !location ||
      !maxMembers
    ) {
      return NextResponse.json(
        { message: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    // 验证时间
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (endDate <= startDate) {
      return NextResponse.json(
        { message: "结束时间必须晚于开始时间" },
        { status: 400 }
      );
    }

    // 如果活动已经开始，不允许修改时间
    const now = new Date();
    if (event.startTime <= now && (startDate.getTime() !== event.startTime.getTime() || endDate.getTime() !== event.endTime.getTime())) {
      return NextResponse.json(
        { message: "活动已开始，无法修改时间" },
        { status: 400 }
      );
    }

    // 更新活动信息
    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        description,
        startTime: startDate,
        endTime: endDate,
        location,
        latitude: parseFloat(latitude) || event.latitude,
        longitude: parseFloat(longitude) || event.longitude,
        maxMembers: parseInt(maxMembers) || event.maxMembers,
        price: parseFloat(price) !== undefined ? parseFloat(price) : event.price,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("更新活动错误:", error);
    return NextResponse.json(
      { message: "更新活动失败" },
      { status: 500 }
    );
  }
}

// 删除活动
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

    // 获取活动信息
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    // 检查活动是否存在
    if (!event) {
      return NextResponse.json(
        { message: "活动不存在" },
        { status: 404 }
      );
    }

    // 检查是否有权限删除（只有创建者可以删除）
    if (event.creatorId !== session.user.id) {
      return NextResponse.json(
        { message: "无权删除此活动" },
        { status: 403 }
      );
    }

    // 删除活动（先删除相关的所有记录，然后删除活动本身）
    await prisma.$transaction([
      prisma.eventMember.deleteMany({
        where: { eventId: params.id },
      }),
      prisma.comment.deleteMany({
        where: { eventId: params.id },
      }),
      prisma.event.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json(
      { message: "活动已删除" },
      { status: 200 }
    );
  } catch (error) {
    console.error("删除活动错误:", error);
    return NextResponse.json(
      { message: "删除活动失败" },
      { status: 500 }
    );
  }
} 