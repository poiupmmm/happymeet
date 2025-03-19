// 简化的授权检查
import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // 简化的授权检查
  const authRequiredPaths = [
    '/dashboard',
    '/events/create',
    '/profile',
    '/settings'
  ];
  
  const needsAuth = authRequiredPaths.some(p => path.startsWith(p)) || 
                   /\/events\/[^/]+\/edit/.test(path);
                   
  if (needsAuth) {
    // 检查会话cookie
    const hasCookie = request.cookies.has('next-auth.session-token') || 
                     request.cookies.has('__Secure-next-auth.session-token');
                     
    if (!hasCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// 简化的授权检查
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/events/create',
    '/events/:path*/edit',
    '/profile',
    '/settings/:path*'
  ]
};
