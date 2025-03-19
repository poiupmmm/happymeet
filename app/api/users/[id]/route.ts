import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 获取用户信息
export async function GET(
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

    // 检查是否有权限访问（只能查看自己的资料）
    if (session.user?.id !== params.id) {
      return NextResponse.json(
        { message: "无权访问" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        interests: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "用户不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("获取用户信息错误:", error);
    return NextResponse.json(
      { message: "获取用户信息失败" },
      { status: 500 }
    );
  }
}

// 更新用户信息
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

    // 检查是否有权限更新（只能更新自己的资料）
    if (session.user?.id !== params.id) {
      return NextResponse.json(
        { message: "无权访问" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, bio, location, interests } = body;

    // 验证输入
    if (!name) {
      return NextResponse.json(
        { message: "姓名不能为空" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        bio,
        location,
        interests,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        interests: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("更新用户信息错误:", error);
    return NextResponse.json(
      { message: "更新用户信息失败" },
      { status: 500 }
    );
  }
} 