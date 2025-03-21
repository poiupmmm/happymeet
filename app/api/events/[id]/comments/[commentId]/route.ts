import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 获取评论详情
export async function GET(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
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

    if (!comment) {
      return NextResponse.json(
        { message: "评论不存在" },
        { status: 404 }
      );
    }

    // 检查评论是否属于指定活动
    if (comment.eventId !== params.id) {
      return NextResponse.json(
        { message: "评论不属于此活动" },
        { status: 400 }
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("获取评论详情错误:", error);
    return NextResponse.json(
      { message: "获取评论详情失败" },
      { status: 500 }
    );
  }
}

// 更新评论
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // 检查是否已登录
    if (!session) {
      return NextResponse.json(
        { message: "未授权" },
        { status: 401 }
      );
    }

    // 获取评论信息
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "评论不存在" },
        { status: 404 }
      );
    }

    // 检查评论是否属于指定活动
    if (comment.eventId !== params.id) {
      return NextResponse.json(
        { message: "评论不属于此活动" },
        { status: 400 }
      );
    }

    // 检查是否有权限更新（只有评论作者可以更新）
    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { message: "无权更新此评论" },
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

    // 更新评论
    const updatedComment = await prisma.comment.update({
      where: { id: params.commentId },
      data: { content },
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

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("更新评论错误:", error);
    return NextResponse.json(
      { message: "更新评论失败" },
      { status: 500 }
    );
  }
}

// 删除评论
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // 检查是否已登录
    if (!session) {
      return NextResponse.json(
        { message: "未授权" },
        { status: 401 }
      );
    }

    // 获取评论信息
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "评论不存在" },
        { status: 404 }
      );
    }

    // 检查评论是否属于指定活动
    if (comment.eventId !== params.id) {
      return NextResponse.json(
        { message: "评论不属于此活动" },
        { status: 400 }
      );
    }

    // 检查是否有权限删除（只有评论作者或活动创建者可以删除）
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return NextResponse.json(
        { message: "活动不存在" },
        { status: 404 }
      );
    }

    if (comment.userId !== session.user.id && event.creatorId !== session.user.id) {
      return NextResponse.json(
        { message: "无权删除此评论" },
        { status: 403 }
      );
    }

    // 删除评论
    await prisma.comment.delete({
      where: { id: params.commentId },
    });

    return NextResponse.json(
      { message: "评论已删除" },
      { status: 200 }
    );
  } catch (error) {
    console.error("删除评论错误:", error);
    return NextResponse.json(
      { message: "删除评论失败" },
      { status: 500 }
    );
  }
} 