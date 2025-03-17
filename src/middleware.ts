import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths.
  const isPublicPath = path === '/login' || path === '/signup';
  
  // Get the token from cookies.
  const token = request.cookies.get('token')?.value || '';

  // If the user is logged in (token exists) and is trying to access a public page,
  // redirect them to the home page. 

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
   
  // If the user is not logged in (no token) and tries to access a protected page,
  // redirect them to the login page. 

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
  
  // Otherwise, continue to the requested page.
  return NextResponse.next();
}
  
// Updated matcher configuration: all paths start with a '/'
export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup', // Fixed: now starts with '/'
  ]
};
