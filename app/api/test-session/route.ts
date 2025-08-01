import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    console.log('Test token data:', token);
    
    return NextResponse.json({ 
      token: token,
      hasToken: !!token,
      hasEmail: !!token?.email,
      userEmail: token?.email
    });
    
  } catch (error) {
    console.error('Error in test session:', error);
    return NextResponse.json(
      { 
        error: 'Session test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 