"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 小组成员角色标签
function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case "ADMIN":
      return (
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
          管理员
        </span>
      );
    case "MODERATOR":
      return (
        <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">
          协管员
        </span>
      );
    default:
      return null;
  }
}

// 活动卡片组件
function EventCard({ event }: { event: any }) {
  const eventDate = new Date(event.startTime);
  const formattedDate = eventDate.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          <Link href={`/events/${event.id}`} className="hover:text-primary">
            {event.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {event.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {event.location} · {event._count.members} 人参加
          </span>
          <Link href={`/events/${event.id}`}>
            <Button size="sm" variant="outline">
              查看详情
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// 成员列表组件
function MembersList({ members, isAdmin }: { members: any[]; isAdmin: boolean }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">小组成员</h2>
        <span className="text-sm text-gray-500">{members.length} 人</span>
      </div>
      <div className="mt-4 space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between border-b border-gray-100 pb-3"
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 text-center leading-8">
                {member.user.name?.charAt(0) || "U"}
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <span className="font-medium">{member.user.name}</span>
                  <div className="ml-2">
                    <RoleBadge role={member.role} />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  加入于 {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {isAdmin && member.role !== "ADMIN" && (
              <Button size="sm" variant="outline">
                管理
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [joinLoading, setJoinLoading] = useState(false);

  // 加载小组数据
  useEffect(() => {
    if (status === "authenticated") {
      fetchGroupData();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, params.id]);

  async function fetchGroupData() {
    try {
      const [groupResponse, eventsResponse, membersResponse] = await Promise.all([
        fetch(`/api/groups/${params.id}`),
        fetch(`/api/groups/${params.id}/events`),
        fetch(`/api/groups/${params.id}/members`),
      ]);

      if (groupResponse.ok && eventsResponse.ok && membersResponse.ok) {
        const groupData = await groupResponse.json();
        const eventsData = await eventsResponse.json();
        const membersData = await membersResponse.json();

        setGroup(groupData);
        setEvents(eventsData.events);
        setMembers(membersData.members);

        // 查找当前用户的成员资格
        const currentUserMembership = membersData.members.find(
          (member: any) => member.user.id === session?.user?.id
        );
        setMembership(currentUserMembership);
      } else {
        console.error("获取小组数据失败");
        router.push("/groups");
      }
    } catch (error) {
      console.error("获取小组数据错误:", error);
    } finally {
      setLoading(false);
    }
  }

  // 加入小组
  async function handleJoinGroup() {
    if (!session?.user?.id) return;
    
    setJoinLoading(true);
    try {
      const response = await fetch(`/api/groups/${params.id}/join`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setMembership(data);
        fetchGroupData(); // 重新加载最新数据
      } else {
        console.error("加入小组失败");
      }
    } catch (error) {
      console.error("加入小组错误:", error);
    } finally {
      setJoinLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">加载中...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">找不到此小组</p>
      </div>
    );
  }

  const isAdmin = membership?.role === "ADMIN";
  const isMember = !!membership;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 小组信息 */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between sm:flex-row sm:items-start">
              <div>
                <h1 className="text-3xl font-bold">{group.name}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    {group.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {group.location}
                  </span>
                </div>
              </div>
              {!isMember ? (
                <Button
                  onClick={handleJoinGroup}
                  disabled={joinLoading}
                  className="mt-4 sm:mt-0"
                >
                  {joinLoading ? "加入中..." : "加入小组"}
                </Button>
              ) : isAdmin ? (
                <Link href={`/groups/${params.id}/edit`}>
                  <Button variant="outline" className="mt-4 sm:mt-0">
                    管理小组
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="mt-4 sm:mt-0" disabled>
                  已加入
                </Button>
              )}
            </div>
            <p className="mt-6 whitespace-pre-line text-gray-700">
              {group.description}
            </p>
            <div className="mt-6 text-sm text-gray-500">
              <p>创建于 {new Date(group.createdAt).toLocaleDateString()}</p>
              <p>创建者: {group.creator.name}</p>
            </div>
          </div>

          {/* 小组活动 */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">小组活动</h2>
              {isMember && (
                <Link href={`/events/create?groupId=${params.id}`}>
                  <Button size="sm">发起活动</Button>
                </Link>
              )}
            </div>

            {events.length === 0 ? (
              <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <h3 className="text-lg font-medium">暂无活动</h3>
                <p className="mt-2 text-gray-500">
                  这个小组还没有举办任何活动
                </p>
                {isMember && (
                  <div className="mt-6">
                    <Link href={`/events/create?groupId=${params.id}`}>
                      <Button>发起活动</Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 小组成员 */}
        <div>
          <MembersList members={members} isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
} 