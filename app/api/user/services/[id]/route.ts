import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const serviceId = params.id;
    const body = await request.json();
    const { isActive } = body;

    // Verify the service belongs to the user
    const service = await prisma.fixedService.findFirst({
      where: {
        id: serviceId,
        providerId: user.id
      }
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Update service status
    const updatedService = await prisma.fixedService.update({
      where: { id: serviceId },
      data: { isActive }
    });

    return NextResponse.json({ 
      service: updatedService,
      message: 'Service status updated successfully' 
    });

  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const serviceId = params.id;

    // Verify the service belongs to the user
    const service = await prisma.fixedService.findFirst({
      where: {
        id: serviceId,
        providerId: user.id
      }
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Delete the service (this will also delete related orders due to cascade)
    await prisma.fixedService.delete({
      where: { id: serviceId }
    });

    return NextResponse.json({ 
      message: 'Service deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
} 