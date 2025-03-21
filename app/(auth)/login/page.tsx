export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// 客户端组件应该在客户端页面中导入，而非服务器组件
import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
} 