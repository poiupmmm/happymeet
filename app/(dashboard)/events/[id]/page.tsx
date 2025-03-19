"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Users, Clock, Edit, Trash, Share, ChevronDown, ChevronUp } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  latitude: number;
  longitude: number;
  maxMembers: number;
  price: number;
  creator: {
    id: string;
    name: string;
    image: string;
  };
  group: {
    id: string;
    name: string;
  };
  members: {
    id: string;
    userId: string;
    joinedAt: string;
    user: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  _count: {
    members: number;
    comments: number;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

// 使用React.memo减少不必要的重渲染
const CommentItem = React.memo(({ comment }: { comment: Comment }) => {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
          {comment.user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{comment.user.name}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700">{comment.content}</p>
        </div>
      </div>
    </Card>
  );
});

CommentItem.displayName = "CommentItem";

export default function EventPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  // 优化状态管理 - 合并加载状态
  const [loadingStates, setLoadingStates] = useState({
    page: true,
    join: false,
    leave: false,
    delete: false,
    comment: false
  });
  const [error, setError] = useState("");
  const [commentContent, setCommentContent] = useState("");
  // 懒加载评论区
  const [showComments, setShowComments] = useState(false);
  // 缓存API响应
  const cachedData = useRef<{
    event?: Event;
    comments?: Comment[];
  }>({});
  // 添加防止重复请求的标记
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && !isLoadingRef.current) {
      fetchEventData();
    }
  }, [params.id, status]);

  // 更新状态函数
  const updateLoadingState = (key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates(prev => ({...prev, [key]: value}));
  };

  // 合并API请求
  const fetchEventData = async () => {
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      updateLoadingState('page', true);
      setError("");

      // 并行发送请求
      const [eventResponse, commentsResponse] = await Promise.all([
        fetch(`/api/events/${params.id}`),
        showComments ? fetch(`/api/events/${params.id}/comments`) : Promise.resolve(null)
      ]);

      const eventData = await eventResponse.json();

      if (!eventResponse.ok) {
        throw new Error(eventData.message || "获取活动详情失败");
      }

      setEvent(eventData);
      cachedData.current.event = eventData;
      
      if (commentsResponse) {
        const commentsData = await commentsResponse.json();
        if (commentsResponse.ok) {
          setComments(commentsData.comments);
          cachedData.current.comments = commentsData.comments;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取活动详情失败");
    } finally {
      updateLoadingState('page', false);
      isLoadingRef.current = false;
    }
  };

  const fetchComments = async () => {
    if (cachedData.current.comments) {
      setComments(cachedData.current.comments);
      return;
    }
    
    try {
      const response = await fetch(`/api/events/${params.id}/comments`);
      const data = await response.json();

      if (response.ok) {
        setComments(data.comments);
        cachedData.current.comments = data.comments;
      }
    } catch (err) {
      console.error("获取评论失败:", err);
    }
  };

  const handleJoinEvent = async () => {
    if (!session) return;
    
    try {
      updateLoadingState('join', true);
      const response = await fetch(`/api/events/${params.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "加入活动失败");
      }

      // 直接更新本地状态，无需重新请求整个活动
      if (event) {
        const updatedEvent = { 
          ...event,
          _count: { 
            ...event._count, 
            members: event._count.members + 1 
          },
          members: [
            ...event.members, 
            { 
              id: data.id,
              userId: session.user?.id as string,
              joinedAt: new Date().toISOString(),
              user: {
                id: session.user?.id as string,
                name: session.user?.name || "用户",
                image: session.user?.image || ""
              }
            }
          ]
        };
        setEvent(updatedEvent);
        cachedData.current.event = updatedEvent;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "加入活动失败");
    } finally {
      updateLoadingState('join', false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!session) return;
    
    try {
      updateLoadingState('leave', true);
      const response = await fetch(`/api/events/${params.id}/join`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "退出活动失败");
      }

      // 直接更新本地状态，无需重新请求整个活动
      if (event) {
        const userId = session.user?.id as string;
        const updatedEvent = { 
          ...event,
          _count: { 
            ...event._count, 
            members: event._count.members - 1 
          },
          members: event.members.filter(member => member.user.id !== userId)
        };
        setEvent(updatedEvent);
        cachedData.current.event = updatedEvent;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "退出活动失败");
    } finally {
      updateLoadingState('leave', false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!session || !event) return;
    
    if (!confirm("确定要删除此活动吗？此操作无法撤销。")) {
      return;
    }
    
    try {
      updateLoadingState('delete', true);
      const response = await fetch(`/api/events/${params.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "删除活动失败");
      }

      router.push('/events');
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除活动失败");
    } finally {
      updateLoadingState('delete', false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !commentContent.trim()) return;
    
    try {
      updateLoadingState('comment', true);
      const response = await fetch(`/api/events/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentContent }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "发表评论失败");
      }

      setCommentContent("");
      
      // 直接更新本地状态，无需重新请求评论列表
      const newComment = {
        id: data.id,
        content: commentContent,
        createdAt: new Date().toISOString(),
        user: {
          id: session.user?.id as string,
          name: session.user?.name || "用户",
          image: session.user?.image || ""
        }
      };
      
      const updatedComments = [newComment, ...comments];
      setComments(updatedComments);
      cachedData.current.comments = updatedComments;
      
      // 更新评论计数
      if (event) {
        const updatedEvent = {
          ...event,
          _count: {
            ...event._count,
            comments: event._count.comments + 1
          }
        };
        setEvent(updatedEvent);
        cachedData.current.event = updatedEvent;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "发表评论失败");
    } finally {
      updateLoadingState('comment', false);
    }
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

  const isEventCreator = event?.creator.id === session?.user?.id;
  const isEventMember = event?.members.some(member => member.user.id === session?.user?.id);
  const hasJoined = isEventCreator || isEventMember;
  const isUpcoming = event ? new Date(event.startTime) > new Date() : false;

  if (loadingStates.page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error || "活动不存在"}</p>
          <Button
            onClick={() => router.push('/events')}
            className="mt-4"
          >
            返回活动列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            返回
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{event.group.name}</Badge>
                {event.price > 0 ? (
                  <Badge variant="outline">¥{event.price}</Badge>
                ) : (
                  <Badge variant="outline">免费</Badge>
                )}
              </div>
            </div>
            
            {isEventCreator && (
              <div className="flex gap-2">
                <Link href={`/events/${event.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteEvent}
                  disabled={loadingStates.delete}
                >
                  <Trash className="w-4 h-4 mr-1" />
                  {loadingStates.delete ? "删除中..." : "删除"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">活动详情</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-2" />
                  <div>
                    <div>开始：{formatDate(event.startTime)}</div>
                    <div>结束：{formatDate(event.endTime)}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{event._count.members}/{event.maxMembers} 人</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              {!hasJoined && isUpcoming && (
                <Button 
                  onClick={handleJoinEvent} 
                  disabled={loadingStates.join || event._count.members >= event.maxMembers}
                  className="mb-4"
                >
                  {loadingStates.join ? "加入中..." : 
                    event._count.members >= event.maxMembers ? "已满员" : "加入活动"}
                </Button>
              )}
              
              {isEventMember && isUpcoming && (
                <Button 
                  variant="outline" 
                  onClick={handleLeaveEvent}
                  disabled={loadingStates.leave}
                  className="mb-4"
                >
                  {loadingStates.leave ? "退出中..." : "退出活动"}
                </Button>
              )}
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {event.members.slice(0, 5).map(member => (
                  <div key={member.id} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      {member.user.name.charAt(0)}
                    </div>
                    <span className="text-xs mt-1">{member.user.name}</span>
                  </div>
                ))}
                {event._count.members > 5 && (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      +{event._count.members - 5}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">活动描述</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
        </Card>

        <div className="mt-10">
          <h2 
            className="text-xl font-semibold mb-4 flex items-center cursor-pointer" 
            onClick={() => {
              setShowComments(prev => !prev);
              if (!showComments && (!cachedData.current.comments || cachedData.current.comments.length === 0)) {
                fetchComments();
              }
            }}
          >
            <span>讨论区 ({event._count.comments})</span>
            <span className="ml-2">
              {showComments ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </span>
          </h2>
          
          {showComments && (
            <>
              {hasJoined && (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <Textarea
                    placeholder="发表评论..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="min-h-[100px] mb-2"
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={loadingStates.comment || !commentContent.trim()}
                    >
                      {loadingStates.comment ? "发表中..." : "发表评论"}
                    </Button>
                  </div>
                </form>
              )}
              
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">暂无评论</p>
                ) : (
                  comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 