"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 兴趣标签列表
const interestOptions = [
  "旅行", "美食", "运动", "阅读", "音乐", "电影", "艺术", "科技", 
  "摄影", "游戏", "户外", "健身", "舞蹈", "烹饪", "语言", "手工"
];

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    interests: [] as string[],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.id) {
      fetchUserProfile(session.user.id);
    }
  }, [status, router, session?.user?.id]);

  async function fetchUserProfile(userId: string) {
    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          location: data.location || "",
          interests: data.interests || [],
        });
      }
    } catch (error) {
      console.error("获取用户资料失败:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const currentInterests = [...prev.interests];
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter((item) => item !== interest),
        };
      } else {
        return {
          ...prev,
          interests: [...currentInterests, interest],
        };
      }
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "个人资料已更新！",
        });
        
        // 更新会话中的用户名
        if (formData.name !== session?.user?.name) {
          await update({ name: formData.name });
        }
      } else {
        const data = await response.json();
        setMessage({
          type: "error",
          text: data.message || "更新失败，请稍后重试",
        });
      }
    } catch (error) {
      console.error("更新用户资料失败:", error);
      setMessage({
        type: "error",
        text: "更新失败，请稍后重试",
      });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">加载中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">个人资料</h1>
        <p className="mt-2 text-gray-600">更新您的个人信息和兴趣爱好</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                姓名
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium">
                个人简介
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium">
                所在地
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">兴趣标签</h2>
          <p className="mb-4 text-sm text-gray-600">
            选择您感兴趣的话题，这将帮助我们为您推荐相关小组和活动
          </p>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                className={`rounded-full px-3 py-1 text-sm ${
                  formData.interests.includes(interest)
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => handleInterestToggle(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {message.text && (
          <div
            className={`rounded-md p-4 ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={updating}>
            {updating ? "保存中..." : "保存资料"}
          </Button>
        </div>
      </form>
    </div>
  );
} 