import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    console.log('=== ACCOUNT UPDATE START ===');
    
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { username, email, currentPassword, newPassword } = body;
    
    console.log('Received account update data:', {
      hasUsername: !!username,
      hasEmail: !!email,
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword
    });

    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const errors: {[key: string]: string} = {};

    // Validate username
    if (username && username !== user.username) {
      if (username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores';
      } else {
        // Check if username is already taken
        const existingUser = await prisma.user.findUnique({
          where: { username }
        });
        if (existingUser) {
          errors.username = 'Username is already taken';
        }
      }
    }

    // Validate email
    if (email && email !== user.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address';
      } else {
        // Check if email is already taken
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });
        if (existingUser) {
          errors.email = 'Email is already taken';
        }
      }
    }

    // Validate password change
    if (newPassword) {
      if (!currentPassword) {
        errors.currentPassword = 'Current password is required to change password';
      } else {
        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password || '');
        if (!isValidPassword) {
          errors.currentPassword = 'Current password is incorrect';
        }
      }

      if (newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return NextResponse.json({ 
        success: false,
        errors 
      }, { status: 400 });
    }

    // Update user data
    const updateData: any = {};
    
    if (username && username !== user.username) {
      updateData.username = username;
    }
    
    if (email && email !== user.email) {
      updateData.email = email;
    }
    
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
      
      console.log('Account updated successfully');
    }

    console.log('=== ACCOUNT UPDATE SUCCESS ===');
    return NextResponse.json({ 
      success: true,
      message: 'Account updated successfully'
    });

  } catch (error) {
    console.error('=== ACCOUNT UPDATE ERROR ===');
    console.error('Error updating account:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 