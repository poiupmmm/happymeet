export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function EventPage({ params }: { params: { id: string } }) {
  // 使用简单的静态UI替代动态导入
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

      <h1 className="text-3xl font-bold mb-4">活动详情 #{params.id}</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">正在加载...</h2>
        <p className="text-gray-700">活动信息将很快显示，请稍候。</p>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // 客户端加载代码
              window.location.href = "/events";
            })();
          `,
        }}
      />
    </div>
  );
} 