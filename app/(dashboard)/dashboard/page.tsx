export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function DashboardPage() {
  // 静态仪表板数据
  const userData = {
    name: "示例用户",
    email: "user@example.com"
  };
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          欢迎，{userData.name}
        </h1>
        <p className="mt-2 text-gray-600">这是您的个人仪表板</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">我的个人资料</h2>
          <p className="mb-4 text-gray-600">更新您的个人信息和兴趣爱好</p>
          <a 
            href="/profile"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            查看资料
          </a>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">我的小组</h2>
          <p className="mb-4 text-gray-600">管理您加入的兴趣小组</p>
          <a 
            href="/groups/my-groups"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            查看小组
          </a>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">我的活动</h2>
          <p className="mb-4 text-gray-600">查看您报名参加的活动</p>
          <a 
            href="/events/my-events"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            查看活动
          </a>
        </div>
      </div>

      <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">推荐活动</h2>
        <p className="text-gray-600">
          暂无推荐活动，请先完善您的个人资料和兴趣标签。
        </p>
      </div>
    </div>
  );
} 