import { NextResponse } from 'next/server';
import { igdbService } from '@/lib/igdb';

export async function GET() {
  try {
    const platforms = await igdbService.getPlatforms();
    
    return NextResponse.json({
      platforms: platforms.map(platform => ({
        id: platform.id,
        name: platform.name
      }))
    });

  } catch (error: any) {
    console.error('Error fetching platforms from IGDB:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch platforms from IGDB',
        platforms: []
      },
      { status: 500 }
    );
  }
} 