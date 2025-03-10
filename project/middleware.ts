import { NextRequest, NextResponse } from "next/server";

// Paths that don't require authentication
const publicPaths = ["/", "/login"];

export async function middleware(request: NextRequest) {
  // With client-side authentication using localStorage, we don't need
  // server-side middleware for authentication checks.
  // The client components will handle redirects based on auth state.
  
  // Just pass through all requests
  return NextResponse.next();
}

// Update the matcher to exclude API routes from middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};