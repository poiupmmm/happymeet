export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// 小组分类列表
const categoryOptions = [
  "全部",
  "户外运动", "文化艺术", "美食烹饪", "科技创新", "读书交流", 
  "亲子活动", "职业发展", "语言学习", "旅行探索", "音乐爱好", 
  "影视娱乐", "健康生活", "社会公益", "棋牌游戏", "摄影分享"
];

// 分页控件
function Pagination() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <a
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
        href="/groups"
      >
        1
      </a>
      <a
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
        href="/groups?page=2"
      >
        2
      </a>
    </div>
  );
}

export default function GroupsPage() {
  // 创建模拟数据
  const groups = [
    {
      id: "1",
      name: "户外探险俱乐部",
      category: "户外运动",
      location: "北京",
      description: "组织各类户外活动，包括徒步、露营、登山等，让城市人亲近自然，挑战自我。",
      creator: { name: "自然爱好者" },
      _count: { members: 128, events: 25 }
    },
    {
      id: "2",
      name: "城市摄影团",
      category: "摄影分享",
      location: "上海",
      description: "记录城市的每一个角落，分享摄影技巧，定期组织拍摄活动和作品展示。",
      creator: { name: "影像记录者" },
      _count: { members: 85, events: 18 }
    },
    {
      id: "3",
      name: "美食品鉴会",
      category: "美食烹饪",
      location: "广州",
      description: "探索各地美食文化，分享烹饪技巧，组织美食制作和品鉴活动。",
      creator: { name: "美食达人" },
      _count: { members: 96, events: 30 }
    },
    {
      id: "4",
      name: "读书分享会",
      category: "读书交流",
      location: "成都",
      description: "每月选择一本书进行深度阅读和讨论，分享阅读心得，扩展知识视野。",
      creator: { name: "书香爱好者" },
      _count: { members: 64, events: 15 }
    },
    {
      id: "5",
      name: "科技创新实验室",
      category: "科技创新",
      location: "深圳",
      description: "关注前沿科技动态，探讨创新想法，组织技术分享和实践活动。",
      creator: { name: "创新者" },
      _count: { members: 72, events: 12 }
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col justify-between sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">小组</h1>
            <p className="mt-2 text-gray-600">发现并加入志同道合的兴趣小组</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <a href="/groups/create" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              创建小组
            </a>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form className="flex w-full max-w-sm items-center space-x-2" onSubmit={e => e.preventDefault()}>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="搜索小组..."
              type="search"
            />
            <button 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              type="submit"
            >
              搜索
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => (
              <a
                key={cat}
                href={cat === "全部" ? "/groups" : `/groups?category=${encodeURIComponent(cat)}`}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80`}
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    <a href={`/groups/${group.id}`} className="hover:text-primary">
                      {group.name}
                    </a>
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
                <a href={`/groups/${group.id}`} className="text-primary hover:underline">
                  查看详情
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination />
      </div>
    </div>
  );
} 