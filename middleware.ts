import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // If user is authenticated and trying to access protected routes
  if (token) {
    const path = request.nextUrl.pathname
    
    // Skip onboarding check for these paths
    const skipOnboardingPaths = [
      '/onboarding',
      '/api/user/onboarding',
      '/api/user/onboarding-status',
      '/api/user/profile',
      '/logout',
      '/api/auth'
    ]
    
    if (skipOnboardingPaths.some(skipPath => path.startsWith(skipPath))) {
      return NextResponse.next()
    }
    
    // Check if user has completed onboarding
    try {
      const onboardingResponse = await fetch(`${request.nextUrl.origin}/api/user/onboarding-status`, {
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        },
      })
      
      if (onboardingResponse.ok) {
        const { completed } = await onboardingResponse.json()
        
        // If onboarding not completed and not already on onboarding page, redirect
        if (!completed && path !== '/onboarding') {
          return NextResponse.redirect(new URL('/onboarding', request.url))
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      // Continue with the request if there's an error - don't block the user
    }
  }
  
  return NextResponse.next()
}

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
} 