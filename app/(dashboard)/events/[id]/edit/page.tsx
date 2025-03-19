"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

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
  group: {
    id: string;
    name: string;
  };
}

// 定义表单验证模式
const formSchema = yup.object({
  title: yup.string().required("请输入活动标题"),
  description: yup.string().required("请输入活动描述"),
  startTime: yup.string().required("请选择开始时间"),
  endTime: yup.string()
    .required("请选择结束时间")
    .test("is-after-start", "结束时间必须晚于开始时间", 
      function(endTime) {
        const { startTime } = this.parent;
        return !startTime || !endTime || new Date(endTime) > new Date(startTime);
      }
    ),
  location: yup.string().required("请输入活动地点"),
  maxMembers: yup.number()
    .required("请设置最大人数")
    .positive("人数必须为正数")
    .integer("人数必须为整数"),
  price: yup.number()
    .required("请设置价格")
    .min(0, "价格不能为负数"),
});

export default function EditEventPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 使用React Hook Form
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      maxMembers: "",
      price: "",
    },
  });
  
  const { formState } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchEventDetails();
    }
  }, [status, router, params.id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/events/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "获取活动详情失败");
      }

      if (data.creator.id !== session?.user?.id) {
        router.push(`/events/${params.id}`);
        return;
      }

      setEvent(data);
      
      // 设置表单默认值
      form.reset({
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime).toISOString().slice(0, 16),
        endTime: new Date(data.endTime).toISOString().slice(0, 16),
        location: data.location,
        maxMembers: data.maxMembers.toString(),
        price: data.price.toString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取活动详情失败");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = useCallback(() => {
    // TODO: 实现地图选点功能
    alert("地图选点功能开发中...");
  }, []);

  const onSubmit = async (values: any) => {
    setError("");

    try {
      const response = await fetch(`/api/events/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          maxMembers: parseInt(values.maxMembers),
          price: parseFloat(values.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "更新活动失败");
      }

      router.push(`/events/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新活动失败");
    }
  };

  if (loading) {
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
            onClick={() => router.back()}
            className="mt-4"
          >
            返回
          </Button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">活动不存在</p>
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
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          返回
        </Button>

        <h1 className="text-3xl font-bold mb-8">编辑活动</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="group">所属群组</Label>
                  <Input
                    id="group"
                    value={event.group.name}
                    disabled
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>活动标题</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>活动描述</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>开始时间</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>结束时间</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>活动地点</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input {...field} />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleLocationSelect}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            选点
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxMembers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>最大人数</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>价格</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            step="0.01"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "保存中..." : "保存修改"}
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
} 