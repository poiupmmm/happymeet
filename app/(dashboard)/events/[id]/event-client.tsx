"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface EventClientProps {
  id: string;
}

export default function EventClient({ id }: EventClientProps) {
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 在客户端模拟获取数据
    setLoading(true);
    setTimeout(() => {
      setEvent({
        id: id,
        title: '示例活动',
        description: '这是一个示例活动描述，用于展示页面布局。',
        startTime: '2023-10-05T10:00:00',
        endTime: '2023-10-05T12:00:00',
        location: '北京市海淀区',
        maxMembers: 20,
        currentMembers: 5,
        price: 0,
        creator: {
          name: '张三',
          id: '1'
        }
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">未找到活动</h2>
          <p className="text-gray-500 mb-6">找不到ID为 {id} 的活动</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          ← 返回
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge>免费</Badge>
          <Badge variant="secondary">{event.currentMembers}/{event.maxMembers} 人参加</Badge>
        </div>
        
        <div className="flex flex-col gap-3 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date(event.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>
              {new Date(event.startTime).toLocaleTimeString()} - 
              {new Date(event.endTime).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>已有 {event.currentMembers} 人参加，剩余 {event.maxMembers - event.currentMembers} 个名额</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">活动描述</h2>
        <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-1"
        >
          参加活动
        </button>
        <button
          onClick={() => router.push(`/events/${id}/edit`)}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          编辑活动
        </button>
      </div>
    </div>
  );
} 