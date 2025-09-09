import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt_token')?.value

  // Handle admin redirects
  if (request.nextUrl.pathname === '/admin') {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const adminUrl = isDevelopment 
      ? 'http://localhost:8000/admin/' 
      : 'https://ftvapi.szlg.info/admin/'
    
    console.log(`🔧 Redirecting ${request.nextUrl.pathname} to admin interface: ${adminUrl}`)
    return NextResponse.redirect(adminUrl)
  }

  // Debug token in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Middleware token check:', {
      path: request.nextUrl.pathname,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'none'
    })
  }

  // Check if token is actually valid (not just present)
  // Note: We can only do basic validation here, full validation happens client-side
  const hasValidToken = token && 
                       token.trim() !== '' && 
                       token !== 'null' && 
                       token !== 'undefined' &&
                       token.length > 10 // Basic sanity check for token length

  // Protected routes - require authentication
  const protectedPaths = ['/app']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Public routes - accessible to everyone
  const publicPaths = ['/', '/login', '/privacy-policy', '/terms-of-service', '/elfelejtett_jelszo', '/admin', '/root']
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname) || 
                      request.nextUrl.pathname.startsWith('/elfelejtett_jelszo/')

  // Auth-only public routes - redirect authenticated users away from these
  const authOnlyPublicPaths = ['/login']
  const isAuthOnlyPublicPath = authOnlyPublicPaths.includes(request.nextUrl.pathname)

  // If trying to access protected route without valid token
  if (isProtectedPath && !hasValidToken) {
    console.log('🚫 Redirecting to login - no valid token for protected route')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If logged in and trying to access auth-only public pages (like login)
  if (hasValidToken && isAuthOnlyPublicPath) {
    console.log('✅ Redirecting authenticated user away from login')
    return NextResponse.redirect(new URL('/app/iranyitopult', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
