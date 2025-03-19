"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 小组分类列表
const categoryOptions = [
  "全部",
  "户外运动", "文化艺术", "美食烹饪", "科技创新", "读书交流", 
  "亲子活动", "职业发展", "语言学习", "旅行探索", "音乐爱好", 
  "影视娱乐", "健康生活", "社会公益", "棋牌游戏", "摄影分享"
];

// 分页控件
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + i;
    return currentPage - 2 + i;
  });

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        上一页
      </Button>

      {pages[0] > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {pages[0] > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-2">...</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        下一页
      </Button>
    </div>
  );
}

// 小组卡片组件
function GroupCard({ group }: { group: any }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              <Link href={`/groups/${group.id}`} className="hover:text-primary">
                {group.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{group.category}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-500">{group.location}</span>
            <span className="mt-1 text-xs text-gray-400">
              {group._count.members} 成员 | {group._count.events} 活动
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600 line-clamp-3">
          {group.description}
        </p>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            创建者: {group.creator.name}
          </span>
          <Link href={`/groups/${group.id}`}>
            <Button size="sm" variant="link">
              查看详情
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 从URL获取查询参数
  const category = searchParams.get("category") || "全部";
  const searchQuery = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1");
  
  const [groups, setGroups] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchQuery);

  // 获取小组列表
  useEffect(() => {
    async function fetchGroups() {
      setLoading(true);
      try {
        let url = `/api/groups?page=${page}&limit=10`;
        
        if (category && category !== "全部") {
          url += `&category=${encodeURIComponent(category)}`;
        }
        
        if (searchQuery) {
          url += `&query=${encodeURIComponent(searchQuery)}`;
        }
        
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          setGroups(data.groups);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("获取小组列表失败:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, [category, searchQuery, page]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ query: searchInput, page: 1 });
  };

  // 处理分类切换
  const handleCategoryChange = (newCategory: string) => {
    updateUrl({ category: newCategory, page: 1 });
  };

  // 处理分页
  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
  };

  // 更新URL参数
  const updateUrl = (params: { category?: string; query?: string; page?: number }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.category !== undefined) {
      if (params.category === "全部") {
        newParams.delete("category");
      } else {
        newParams.set("category", params.category);
      }
    }
    
    if (params.query !== undefined) {
      if (params.query) {
        newParams.set("query", params.query);
      } else {
        newParams.delete("query");
      }
    }
    
    if (params.page !== undefined) {
      if (params.page <= 1) {
        newParams.delete("page");
      } else {
        newParams.set("page", params.page.toString());
      }
    }
    
    router.push(`/groups?${newParams.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col justify-between sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">小组</h1>
            <p className="mt-2 text-gray-600">发现并加入志同道合的兴趣小组</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/groups/create">
              <Button>创建小组</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                className={`rounded-full px-3 py-1 text-sm ${
                  category === cat
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="flex w-full max-w-sm">
            <Input
              placeholder="搜索小组..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="mr-2"
            />
            <Button type="submit">搜索</Button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-gray-500">加载中...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center shadow-sm">
          <h3 className="text-lg font-medium">未找到小组</h3>
          <p className="mt-2 text-gray-500">
            {searchQuery
              ? `没有找到与"${searchQuery}"相关的小组`
              : "此分类下暂无小组，快来创建第一个吧！"}
          </p>
          <div className="mt-6">
            <Link href="/groups/create">
              <Button>创建小组</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
} 