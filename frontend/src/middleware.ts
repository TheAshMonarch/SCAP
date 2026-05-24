import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // We no longer rely on cookies for access token (it's in memory)
  // So we allow access and let the frontend handle auth state

  // if (isAuthPage) {
    // Optional: You can still check for refresh token cookie if you want
  //   const hasRefreshToken = request.cookies.has('refreshToken');
  //   if (hasRefreshToken) {
  //     return NextResponse.redirect(new URL('/dashboard', request.url));
  //   }
  // }

  // For now, allow everything and let API calls + frontend handle auth
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
};