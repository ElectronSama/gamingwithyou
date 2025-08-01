import { NextResponse } from 'next/server';
import { igdbService } from '@/lib/igdb';

export async function GET() {
  try {
    const genres = await igdbService.getGenres();
    
    return NextResponse.json({
      genres: genres.map(genre => ({
        id: genre.id,
        name: genre.name
      }))
    });

  } catch (error: any) {
    console.error('Error fetching genres from IGDB:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch genres from IGDB',
        genres: []
      },
      { status: 500 }
    );
  }
} 