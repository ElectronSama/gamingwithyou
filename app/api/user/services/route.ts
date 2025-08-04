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

    // Get user's services with order statistics
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
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform services with statistics
    const transformedServices = services.map(service => {
      const completedOrders = service.orders.filter(order => order.status === 'completed');
      const totalEarnings = completedOrders.reduce((sum, order) => sum + order.price, 0);
      const averageRating = 4.5; // TODO: Calculate from reviews when available

      return {
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration,
        gameId: service.gameId,
        gameName: service.gameName,
        platformId: service.platformId,
        platformName: service.platformName,
        isActive: service.isActive,
        createdAt: service.createdAt.toISOString(),
        ordersCount: service.orders.length,
        totalEarnings,
        averageRating
      };
    });

    return NextResponse.json({ services: transformedServices });

  } catch (error) {
    console.error('Error fetching user services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, description, price, duration, gameId, gameName, platformId, platformName } = body;

    if (!title || !description || !price || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const service = await prisma.fixedService.create({
      data: {
        providerId: user.id,
        title,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        gameId: gameId || null,
        gameName: gameName || null,
        platformId: platformId || null,
        platformName: platformName || null,
        isActive: true
      }
    });

    return NextResponse.json({ 
      service,
      message: 'Service created successfully' 
    });

  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
} 