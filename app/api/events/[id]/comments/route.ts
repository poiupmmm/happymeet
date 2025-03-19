import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 获取活动评论列表
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

    // 获取评论列表
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
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
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({
        where: { eventId: params.id },
      }),
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取活动评论错误:", error);
    return NextResponse.json(
      { message: "获取活动评论失败" },
      { status: 500 }
    );
  }
}

// 创建活动评论
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
        { message: "只有活动成员才能发表评论" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content } = body;

    // 验证评论内容
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: "评论内容不能为空" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { message: "评论内容不能超过1000字" },
        { status: 400 }
      );
    }

    // 创建评论
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        eventId,
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

    return NextResponse.json(comment);
  } catch (error) {
    console.error("创建活动评论错误:", error);
    return NextResponse.json(
      { message: "创建活动评论失败" },
      { status: 500 }
    );
  }
} 