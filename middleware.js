// �򻯵��м��ʵ�֣�����ʹ�ò����ݵİ�
import { NextResponse } from 'next/server';

export function middleware(request) {
  // ��ȡ·��
  const path = request.nextUrl.pathname;
  
  // ����Ƿ��лỰcookie
  const sessionCookie = request.cookies.get('next-auth.session-token') || 
                        request.cookies.get('__Secure-next-auth.session-token');
  
  // ��Ҫ�����֤��·��
  const authRequiredPaths = [
    '/events/create',
    '/events/edit',
    '/profile',
    '/settings',
    '/dashboard'
  ];
  
  // ��鵱ǰ·���Ƿ���Ҫ�����֤
  const needsAuth = authRequiredPaths.some(authPath => 
    path.startsWith(authPath) || path.match(/\/events\/[^/]+\/edit/)
  );
  
  // �����Ҫ�����֤��û�лỰcookie���ض��򵽵�¼ҳ��
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
