import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 获取活动列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");
    const location = searchParams.get("location");
    const query = searchParams.get("query");
    const upcoming = searchParams.get("upcoming") === "true";
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (groupId) {
      where.groupId = groupId;
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ];
    }

    if (upcoming) {
      where.startTime = {
        gte: new Date(),
      };
    }

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
          group: {
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
    console.error("获取活动列表错误:", error);
    return NextResponse.json(
      { message: "获取活动列表失败" },
      { status: 500 }
    );
  }
}

// 创建活动
export async function POST(request: Request) {
  try {
    const session = await auth();

    // 检查是否已登录
    if (!session) {
      return NextResponse.json(
        { message: "未授权" },
        { status: 401 }
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
      groupId,
    } = body;

    // 验证输入
    if (
      !title ||
      !description ||
      !startTime ||
      !endTime ||
      !location ||
      !maxMembers ||
      !groupId
    ) {
      return NextResponse.json(
        { message: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    // 验证时间
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    if (startDate < now) {
      return NextResponse.json(
        { message: "开始时间不能早于当前时间" },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { message: "结束时间必须晚于开始时间" },
        { status: 400 }
      );
    }

    // 检查用户是否是小组成员
    const isMember = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: session.user.id,
      },
    });

    if (!isMember) {
      return NextResponse.json(
        { message: "只有小组成员才能创建活动" },
        { status: 403 }
      );
    }

    // 创建活动
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: startDate,
        endTime: endDate,
        location,
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
        maxMembers: parseInt(maxMembers) || 10,
        price: parseFloat(price) || 0,
        creator: {
          connect: {
            id: session.user.id,
          },
        },
        group: {
          connect: {
            id: groupId,
          },
        },
        members: {
          create: {
            userId: session.user.id,
            status: "CONFIRMED", // 创建者自动确认参加
          },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("创建活动错误:", error);
    return NextResponse.json(
      { message: "创建活动失败" },
      { status: 500 }
    );
  }
} 