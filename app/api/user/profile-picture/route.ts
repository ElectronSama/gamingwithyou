import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('=== PROFILE PICTURE UPLOAD START ===')
    
    const session = await getServerSession(authOptions)
    
    console.log('Session:', session ? 'exists' : 'missing')
    console.log('Session user:', session?.user)
    console.log('Session user email:', session?.user?.email)
    console.log('Session user id:', session?.user?.id)
    
    if (!session?.user) {
      console.log('No session user, returning 401')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an image.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profile-pictures')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${session.user.id}-${timestamp}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the image URL
    const imageUrl = `/uploads/profile-pictures/${fileName}`

    // Get user from database to get the correct ID
    console.log('Looking for user with email:', session.user.email)
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    console.log('User found:', user ? 'yes' : 'no')
    console.log('User data:', user)

    if (!user) {
      console.log('User not found in database, returning 404')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user's avatar in database
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: imageUrl }
    })

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: 'Profile picture uploaded successfully' 
    })

  } catch (error) {
    console.error('Error uploading profile picture:', error)
    return NextResponse.json(
      { error: 'Failed to upload profile picture' }, 
      { status: 500 }
    )
  }
} 