"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">加载中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          欢迎，{session?.user?.name || "用户"}
        </h1>
        <p className="mt-2 text-gray-600">这是您的个人仪表板</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">我的个人资料</h2>
          <p className="mb-4 text-gray-600">更新您的个人信息和兴趣爱好</p>
          <Link href="/profile">
            <Button variant="outline">查看资料</Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">我的小组</h2>
          <p className="mb-4 text-gray-600">管理您加入的兴趣小组</p>
          <Link href="/groups/my-groups">
            <Button variant="outline">查看小组</Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">我的活动</h2>
          <p className="mb-4 text-gray-600">查看您报名参加的活动</p>
          <Link href="/events/my-events">
            <Button variant="outline">查看活动</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">推荐活动</h2>
        <p className="text-gray-600">
          暂无推荐活动，请先完善您的个人资料和兴趣标签。
        </p>
      </div>
    </div>
  );
} 