import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all games that users are playing
    const games = await prisma.game.findMany({
      where: {
        isActive: true,
        userGames: {
          some: {
            user: {
              isAdmin: false
            }
          }
        }
      },
      select: {
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Get all languages that users speak
    const languages = await prisma.userLanguage.findMany({
      where: {
        user: {
          isAdmin: false
        }
      },
      select: {
        language: true
      },
      distinct: ['language'],
      orderBy: {
        language: 'asc'
      }
    });

    // Get all tags that users have, excluding category tags
    const tags = await prisma.userTag.findMany({
      where: {
        user: {
          isAdmin: false
        },
        tag: {
          not: {
            startsWith: 'category:'
          }
        }
      },
      select: {
        tag: true
      },
      distinct: ['tag'],
      orderBy: {
        tag: 'asc'
      }
    });

    return NextResponse.json({
      games: ['All', ...games.map(g => g.name)],
      languages: ['All', ...languages.map(l => l.language)],
      tags: ['All', ...tags.map(t => t.tag)]
    });

  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
} 