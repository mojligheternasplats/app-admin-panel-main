import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authToken = request.cookies.get('token')?.value;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

  // If trying to access a public path, let them through
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If trying to access the root, redirect to dashboard if logged in, or login if not
  if (pathname === '/') {
    if (authToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url)); 
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For any other path (e.g., /dashboard and its children), check for token
  if (!authToken) {
    // If no token and not a public path, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
