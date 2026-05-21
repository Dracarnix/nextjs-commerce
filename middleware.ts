import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page to be accessed without authentication
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for session cookie on protected admin routes
  if (pathname.startsWith('/admin/')) {
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
