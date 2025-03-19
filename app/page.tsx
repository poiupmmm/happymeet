import React from "react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">HappyMeet</h1>
      <p className="text-xl mb-8">您的活动管理平台</p>
      
      <div className="flex gap-4 mt-8">
        <a 
          href="/events" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          浏览活动
        </a>
        <a 
          href="/login" 
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          登录
        </a>
      </div>
    </div>
  );
} 