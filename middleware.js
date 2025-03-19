import { NextResponse } from 'next/server';

// 极简中间件实现
export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // 公开路径直接放行
  if (
    path === '/' || 
    path === '/login' || 
    path === '/events' || 
    path.startsWith('/_next') || 
    path.startsWith('/api') ||
    path.includes('.') // 静态文件
  ) {
    return NextResponse.next();
  }
  
  // 受保护路径检查认证
  const hasSession = request.cookies.has('next-auth.session-token') || 
                     request.cookies.has('__Secure-next-auth.session-token');
                     
  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// 使用简单匹配器，显式排除根路径
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
