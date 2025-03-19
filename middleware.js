// ��򻯵��м��ʵ��
import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // �򻯵���Ȩ���
  if (path.includes('/dashboard') || 
      path.startsWith('/events/create') || 
      path.includes('/edit') || 
      path.startsWith('/profile') || 
      path.startsWith('/settings')) {
    
    // ���������ĻỰcookie
    const hasCookie = request.cookies.has('next-auth.session-token') || 
                     request.cookies.has('__Secure-next-auth.session-token');
                     
    if (!hasCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// �򻯵�matcher����
export const config = {
  matcher: [
    '/(dashboard|events/create|profile|settings)/:path*',
    '/events/:path*/edit'
  ]
};
