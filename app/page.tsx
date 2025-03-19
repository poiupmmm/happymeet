export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          欢迎来到 HappyMeet
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-700">
          发现和参与你感兴趣的活动，结识志同道合的朋友
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <a
            href="/events"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            浏览活动
          </a>
          <a
            href="/login"
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            登录
          </a>
        </div>
      </div>
    </main>
  );
} 