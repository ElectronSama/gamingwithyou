import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    console.log('=== ACCOUNT UPDATE START ===');
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
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
      where: { email: session.user.email }
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

export async function PATCH(request: NextRequest) {
  try {
    console.log('=== ACCOUNT STATUS TOGGLE START ===');
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isActive } = body;

    console.log('Received isActive value:', isActive, typeof isActive);

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ 
        success: false,
        error: 'isActive must be a boolean value' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Found user:', { id: user.id, email: user.email, hasIsActive: 'isActive' in user });

    // Update account status
    try {
      console.log('Attempting to update user with isActive:', isActive);
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { isActive }
      });
      console.log('User updated successfully:', { id: updatedUser.id, isActive: updatedUser.isActive });
    } catch (error) {
      console.error('Error updating isActive field:', error);
      // If isActive field doesn't exist, try updating without it
      if (error instanceof Error && error.message.includes('isActive')) {
        console.log('isActive field not found, skipping status update');
        return NextResponse.json({ 
          success: false,
          error: 'Account status feature not available yet. Please contact support.' 
        }, { status: 400 });
      }
      throw error;
    }

    console.log('=== ACCOUNT STATUS TOGGLE SUCCESS ===');
    return NextResponse.json({ 
      success: true,
      message: `Account ${isActive ? 'activated' : 'deactivated'} successfully`,
      isActive
    });

  } catch (error) {
    console.error('=== ACCOUNT STATUS TOGGLE ERROR ===');
    console.error('Error toggling account status:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update account status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('=== ACCOUNT DELETION START ===');
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { password, confirmText } = body;

    if (!password) {
      return NextResponse.json({ 
        success: false,
        error: 'Password is required to delete account' 
      }, { status: 400 });
    }

    if (confirmText !== 'DELETE') {
      return NextResponse.json({ 
        success: false,
        error: 'Please type DELETE to confirm account deletion' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password || '');
    if (!isValidPassword) {
      return NextResponse.json({ 
        success: false,
        error: 'Password is incorrect' 
      }, { status: 400 });
    }

    // Delete user account (this will cascade delete related data)
    await prisma.user.delete({
      where: { id: user.id }
    });

    console.log('=== ACCOUNT DELETION SUCCESS ===');
    return NextResponse.json({ 
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('=== ACCOUNT DELETION ERROR ===');
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 