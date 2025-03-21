export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function EventPage({ params }: { params: { id: string } }) {
  // 使用静态UI替代动态导入
  const eventId = params.id;
  const event = {
    id: eventId,
    title: `活动 #${eventId}`,
    description: '这是一个示例活动描述，用于展示静态页面布局。',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    location: '北京市海淀区',
    maxMembers: 20,
    currentMembers: 5,
    price: 0,
    creator: {
      name: '示例用户',
      id: '1'
    }
  };

  // 格式化日期和时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <a
          href="/events"
          className="text-blue-600 hover:underline"
        >
          ← 返回
        </a>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            免费
          </span>
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
            {event.currentMembers}/{event.maxMembers} 人参加
          </span>
        </div>
        
        <div className="flex flex-col gap-3 text-gray-600">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{formatDate(event.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🕒</span>
            <span>
              {formatTime(event.startTime)} - 
              {formatTime(event.endTime)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>已有 {event.currentMembers} 人参加，剩余 {event.maxMembers - event.currentMembers} 个名额</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">活动描述</h2>
        <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
      </div>

      <div className="flex gap-4 mb-8">
        <a
          href={`/events/${event.id}/join`}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-1 text-center"
        >
          参加活动
        </a>
        <a
          href={`/events/${event.id}/edit`}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center"
        >
          编辑活动
        </a>
      </div>
    </div>
  );
} 