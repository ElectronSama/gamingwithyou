import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST SESSION API ===');
    
    const session = await getServerSession(authOptions);
    
    console.log('Session:', session ? 'exists' : 'missing');
    console.log('Session user:', session?.user);
    console.log('Session user email:', session?.user?.email);
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'No session found',
        session: null
      }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true,
      session: {
        user: {
          email: session.user.email,
          username: session.user.username,
          id: session.user.id
        }
      }
    });

  } catch (error) {
    console.error('Error in test session:', error);
    return NextResponse.json(
      { error: 'Session test failed' },
      { status: 500 }
    );
  }
} 