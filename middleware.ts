import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest) {
    return undefined;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect /admin/editor and all routes under it
        if (req.nextUrl.pathname.startsWith('/admin/editor')) {
          return !!token;
        }
        // Allow /admin/login for everyone
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
