// 简化的中间件实现，避免使用不兼容的包
import { NextResponse } from 'next/server';

export function middleware(request) {
  // 获取路径
  const path = request.nextUrl.pathname;
  
  // 检查是否有会话cookie
  const sessionCookie = request.cookies.get('next-auth.session-token') || 
                        request.cookies.get('__Secure-next-auth.session-token');
  
  // 需要身份验证的路径
  const authRequiredPaths = [
    '/events/create',
    '/events/edit',
    '/profile',
    '/settings',
    '/dashboard'
  ];
  
  // 检查当前路径是否需要身份验证
  const needsAuth = authRequiredPaths.some(authPath => 
    path.startsWith(authPath) || path.match(/\/events\/[^/]+\/edit/)
  );
  
  // 如果需要身份验证但没有会话cookie，重定向到登录页面
  if (needsAuth && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/events/create',
    '/events/:id/edit',
    '/profile',
    '/settings/:path*',
    '/dashboard/:path*'
  ]
};
