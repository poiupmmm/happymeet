export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">欢迎回来</h2>
          <p className="mt-2 text-sm text-gray-600">
            登录您的HappyMeet账号
          </p>
        </div>

        <form action="/api/auth/signin/credentials" method="post" className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
          >
            登录
          </button>
        </form>

        <div className="text-center text-sm">
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            还没有账号？立即注册
          </a>
        </div>
      </div>
    </div>
  );
} 