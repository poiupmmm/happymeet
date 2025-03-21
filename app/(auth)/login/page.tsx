export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* 在这里加载客户端组件 */}
      <div id="login-form-container" className="w-full max-w-md">
        {/* 客户端登录表单将在此处动态加载 */}
        <LoginForm />
      </div>
    </div>
  );
}

// 客户端组件包装
import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('./login-form'), {
  ssr: false,
  loading: () => (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">加载中...</p>
    </div>
  ),
}); 