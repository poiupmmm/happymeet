export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function EventsPage() {
  // 创建模拟数据
  const events = [
    {
      id: "1",
      title: "户外徒步活动",
      description: "一起探索自然美景，享受徒步乐趣",
      startTime: new Date().toISOString(),
      location: "城市公园",
      maxMembers: 20,
      currentMembers: 10,
      price: 0,
      group: {
        name: "户外探险俱乐部"
      }
    },
    {
      id: "2",
      title: "读书会聚会",
      description: "分享阅读心得，探讨经典文学作品",
      startTime: new Date(Date.now() + 86400000).toISOString(),
      location: "中心图书馆",
      maxMembers: 15,
      currentMembers: 7,
      price: 10,
      group: {
        name: "悦读书友会"
      }
    },
    {
      id: "3",
      title: "摄影技巧分享会",
      description: "交流摄影技巧，分享精彩作品",
      startTime: new Date(Date.now() + 172800000).toISOString(),
      location: "艺术中心",
      maxMembers: 12,
      currentMembers: 5,
      price: 20,
      group: {
        name: "影像爱好者"
      }
    }
  ];

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">活动列表</h1>
        <a 
          href="/events/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          创建活动
        </a>
      </div>

      <div className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="搜索活动..."
            className="flex-1 rounded-md border border-gray-300 p-2"
          />
          <input
            type="text"
            placeholder="地点..."
            className="flex-1 rounded-md border border-gray-300 p-2"
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              即将开始
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              全部活动
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <a
            key={event.id}
            href={`/events/${event.id}`}
            className="block"
          >
            <div className="p-6 hover:shadow-lg transition-shadow rounded-lg border">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <span className="mr-2">📅</span>
                  <span>{formatDate(event.startTime)}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <span className="mr-2">📍</span>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <span className="mr-2">👥</span>
                  <span>
                    {event.currentMembers}/{event.maxMembers} 人
                  </span>
                </div>
                {event.price > 0 && (
                  <div className="flex items-center text-gray-500">
                    <span className="mr-2">💰</span>
                    <span>¥{event.price}</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <span className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded">{event.group.name}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 