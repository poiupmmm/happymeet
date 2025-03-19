// 最简化的中间件实现
import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // 简化的授权检查
  if (path.includes('/dashboard') || 
      path.startsWith('/events/create') || 
      path.includes('/edit') || 
      path.startsWith('/profile') || 
      path.startsWith('/settings')) {
    
    // 检查最基本的会话cookie
    const hasCookie = request.cookies.has('next-auth.session-token') || 
                     request.cookies.has('__Secure-next-auth.session-token');
                     
    if (!hasCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// 简化的matcher配置
export const config = {
  matcher: [
    '/(dashboard|events/create|profile|settings)/:path*',
    '/events/:path*/edit'
  ]
};
