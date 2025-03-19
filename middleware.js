import { NextResponse } from 'next/server';

// 极简中间件实现
export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // 需要认证的路径前缀
  if (path.startsWith('/dashboard') || 
      path.startsWith('/events/create') || 
      path.startsWith('/profile') || 
      path.startsWith('/settings') ||
      path.includes('/edit')) {
    
    // 检查会话cookie
    if (!request.cookies.has('next-auth.session-token') && 
        !request.cookies.has('__Secure-next-auth.session-token')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// 使用简单匹配器
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/events/create', 
    '/events/:id/edit', 
    '/profile', 
    '/settings/:path*'
  ]
};
