export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function CreateEventPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <a
          href="/events"
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          ← 返回
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-8">创建新活动</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <p className="mb-6 text-gray-600">
          此功能在演示模式下不可用
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">活动标题</label>
            <input
              id="title"
              type="text"
              placeholder="请输入活动标题"
              className="w-full rounded-md border border-gray-300 p-2 mt-1"
            />
          </div>

          <div>
            <label htmlFor="group" className="block text-sm font-medium">所属群组</label>
            <select id="group" className="w-full rounded-md border border-gray-300 p-2 mt-1">
              <option value="">请选择群组</option>
              <option value="1">户外探险俱乐部</option>
              <option value="2">读书会</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium">活动地点</label>
            <div className="flex gap-2 mt-1">
              <input
                id="location"
                type="text"
                placeholder="请输入活动地点"
                className="flex-1 rounded-md border border-gray-300 p-2"
              />
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
              >
                选点
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href="/events"
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              取消
            </a>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              创建活动
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 