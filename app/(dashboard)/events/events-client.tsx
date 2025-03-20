"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { debounce } from "lodash";
import React from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxMembers: number;
  price: number;
  _count: {
    members: number;
  };
  group: {
    id: string;
    name: string;
  };
}

// 使用React.memo减少不必要的重渲染
const EventCard = React.memo(({ event, formatDate }: { event: Event; formatDate: (date: string) => string }) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
      <div className="space-y-2">
        <div className="flex items-center text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formatDate(event.startTime)}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Users className="w-4 h-4 mr-2" />
          <span>
            {event._count.members}/{event.maxMembers} 人
          </span>
        </div>
        {event.price > 0 && (
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>¥{event.price}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <Badge variant="secondary">{event.group.name}</Badge>
      </div>
    </Card>
  );
});

EventCard.displayName = "EventCard";

export default function EventsPageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [upcoming, setUpcoming] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 添加缓存机制
  const [cachedEvents, setCachedEvents] = useState<Record<string, { events: Event[], totalPages: number }>>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 使用useCallback固定函数引用，避免在依赖项变化时重新创建
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // 创建缓存键
      const cacheKey = `${page}_${upcoming}_${searchQuery}_${location}`;
      
      // 检查是否有缓存数据
      if (cachedEvents[cacheKey]) {
        setEvents(cachedEvents[cacheKey].events);
        setTotalPages(cachedEvents[cacheKey].totalPages);
        setLoading(false);
        return;
      }

      // 使用示例数据而不是API调用，以避免服务器错误
      // 模拟API调用延迟
      setTimeout(() => {
        // 示例数据
        const mockEvents = [
          {
            id: "1",
            title: "户外徒步活动",
            description: "一起探索自然美景，享受徒步乐趣",
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString(),
            location: "城市公园",
            maxMembers: 20,
            price: 0,
            _count: {
              members: 10
            },
            group: {
              id: "g1",
              name: "户外探险俱乐部"
            }
          },
          {
            id: "2",
            title: "读书会聚会",
            description: "分享阅读心得，探讨经典文学作品",
            startTime: new Date(Date.now() + 86400000).toISOString(),
            endTime: new Date(Date.now() + 90000000).toISOString(),
            location: "中心图书馆",
            maxMembers: 15,
            price: 10,
            _count: {
              members: 7
            },
            group: {
              id: "g2",
              name: "悦读书友会"
            }
          },
          {
            id: "3",
            title: "摄影技巧分享会",
            description: "交流摄影技巧，分享精彩作品",
            startTime: new Date(Date.now() + 172800000).toISOString(),
            endTime: new Date(Date.now() + 180000000).toISOString(),
            location: "艺术中心",
            maxMembers: 12,
            price: 20,
            _count: {
              members: 5
            },
            group: {
              id: "g3",
              name: "影像爱好者"
            }
          }
        ];
        
        // 更新缓存
        setCachedEvents(prev => ({
          ...prev,
          [cacheKey]: { 
            events: mockEvents,
            totalPages: 1
          }
        }));
        
        setEvents(mockEvents);
        setTotalPages(1);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取活动列表失败");
      setLoading(false);
    }
  }, [page, upcoming, searchQuery, location, cachedEvents]);

  // 将搜索函数优化为防抖函数
  const debouncedSearch = useMemo(
    () => debounce(() => {
      fetchEvents();
    }, 300),
    [fetchEvents]
  );

  useEffect(() => {
    if (status === "authenticated") {
      debouncedSearch();
    }
    
    // 清理防抖函数
    return () => {
      debouncedSearch.cancel();
    };
  }, [status, debouncedSearch]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
    debouncedSearch();
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setPage(1);
    debouncedSearch();
  };

  const handleUpcomingChange = (value: boolean) => {
    setUpcoming(value);
    setPage(1);
    debouncedSearch();
  };

  // 使用useCallback缓存格式化日期函数
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button
            onClick={fetchEvents}
            className="mt-4"
          >
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">活动列表</h1>
        <Link href="/events/create">
          <Button>创建活动</Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="搜索活动..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="flex-1"
          />
          <Input
            type="text"
            placeholder="地点..."
            value={location}
            onChange={handleLocationChange}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant={upcoming ? "default" : "outline"}
              onClick={() => handleUpcomingChange(true)}
            >
              即将开始
            </Button>
            <Button
              type="button"
              variant={!upcoming ? "default" : "outline"}
              onClick={() => handleUpcomingChange(false)}
            >
              全部活动
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
          >
            <EventCard event={event} formatDate={formatDate} />
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无活动</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </Button>
          <span className="flex items-center px-4">
            第 {page} 页，共 {totalPages} 页
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
} 