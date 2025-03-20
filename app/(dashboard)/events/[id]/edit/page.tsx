"use client";

import { useRouter } from 'next/navigation';

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">编辑活动</h1>
      
      <p className="mb-4">
        活动ID: {params.id}
      </p>
      
      <p className="mb-6 text-gray-600">
        此功能在演示模式下不可用
      </p>
      
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        返回
      </button>
    </div>
  );
} 