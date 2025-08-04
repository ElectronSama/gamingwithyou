import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    // Get all user's services
    const services = await prisma.fixedService.findMany({
      where: { providerId: user.id },
      include: {
        orders: {
          select: {
            id: true,
            price: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    // Calculate statistics
    const totalServices = services.length;
    const activeServices = services.filter(service => service.isActive).length;
    const totalOrders = services.reduce((sum, service) => sum + service.orders.length, 0);
    const completedOrders = services.flatMap(service => 
      service.orders.filter(order => order.status === 'completed')
    );
    const totalEarnings = completedOrders.reduce((sum, order) => sum + order.price, 0);
    
    // Calculate average rating (placeholder for now)
    const averageRating = totalOrders > 0 ? 4.5 : 0;

    const stats = {
      totalServices,
      activeServices,
      totalOrders,
      totalEarnings,
      averageRating
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching service stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 