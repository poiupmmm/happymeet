"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 小组分类列表
const categoryOptions = [
  "户外运动", "文化艺术", "美食烹饪", "科技创新", "读书交流", 
  "亲子活动", "职业发展", "语言学习", "旅行探索", "音乐爱好", 
  "影视娱乐", "健康生活", "社会公益", "棋牌游戏", "摄影分享"
];

export default function CreateGroupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    latitude: 0,
    longitude: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  // 模拟地理位置选择，实际项目中应该使用地图API
  const handleLocationSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      location: value,
      // 这里应该通过地图API获取地理坐标，这里只是模拟
      latitude: 30 + Math.random() * 10,
      longitude: 110 + Math.random() * 10,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/groups/${data.id}`);
      } else {
        const data = await response.json();
        setError(data.message || "创建小组失败");
      }
    } catch (error) {
      console.error("创建小组错误:", error);
      setError("创建小组失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">创建小组</h1>
        <p className="mt-2 text-gray-600">创建一个新的兴趣小组，邀请志同道合的朋友加入</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                小组名称
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
                placeholder="给你的小组起个名字"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium">
                小组描述
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="介绍一下你的小组，吸引更多人加入"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                小组分类
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`rounded-full px-3 py-1 text-sm ${
                      formData.category === category
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium">
                小组地点
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleLocationSelect}
                className="mt-1"
                placeholder="小组所在的城市或地区"
              />
              <p className="mt-1 text-xs text-gray-500">
                在实际应用中，这里应该有一个地图选择器
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="mr-2"
            onClick={() => router.back()}
          >
            取消
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "创建中..." : "创建小组"}
          </Button>
        </div>
      </form>
    </div>
  );
} 