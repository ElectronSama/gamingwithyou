import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // Log all cookies
    const cookies = request.headers.get('cookie');
    console.log('All cookies:', cookies);
    
    // Try to get token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    console.log('Debug token data:', token);
    
    // Check for specific auth cookies
    const authCookies = cookies?.split(';').filter(cookie => 
      cookie.includes('next-auth') || cookie.includes('auth')
    );
    
    return NextResponse.json({ 
      token: token,
      hasToken: !!token,
      hasEmail: !!token?.email,
      userEmail: token?.email,
      allCookies: cookies,
      authCookies: authCookies,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET
    });
    
  } catch (error) {
    console.error('Error in debug session:', error);
    return NextResponse.json(
      { 
        error: 'Debug session failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 