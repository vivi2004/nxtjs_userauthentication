import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths
  const isPublicPath = [
    '/login',
    '/signup',
    '/verifyemail',
    '/forgot-password',
    '/reset-password'
  ].includes(path);

  // Get the token from cookies
  const token = request.cookies.get('token')?.value || '';

  // Redirect authenticated users from public pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Protect non-public pages for unauthenticated users
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Special case for reset-password URL validation
  if (path === '/reset-password') {
    const tokenParam = request.nextUrl.searchParams.get('token');
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!tokenParam || !userId) {
      return NextResponse.redirect(new URL('/forgot-password', request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
    '/forgot-password',
    '/reset-password'
  ]
};   
  