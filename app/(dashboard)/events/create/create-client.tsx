"use client";

import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Select, SelectOption } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

export default function CreateEventClient() {
  const router = useRouter();
  
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

      <h1 className="text-2xl font-bold mb-8">创建新活动</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <p className="mb-6 text-gray-600">
          此功能在演示模式下不可用
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="title">活动标题</Label>
            <input
              id="title"
              type="text"
              placeholder="请输入活动标题"
              className="w-full rounded-md border border-gray-300 p-2 mt-1"
            />
          </div>

          <div>
            <Label htmlFor="group">所属群组</Label>
            <Select id="group" className="mt-1">
              <SelectOption value="">请选择群组</SelectOption>
              <SelectOption value="1">户外探险俱乐部</SelectOption>
              <SelectOption value="2">读书会</SelectOption>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">活动地点</Label>
            <div className="flex gap-2 mt-1">
              <input
                id="location"
                type="text"
                placeholder="请输入活动地点"
                className="flex-1 rounded-md border border-gray-300 p-2"
              />
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
              >
                <MapPin size={16} />
                选点
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/events')}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              创建活动
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 