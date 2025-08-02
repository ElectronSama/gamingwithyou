import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameSlug = searchParams.get('gameSlug')
    const gameName = searchParams.get('gameName')

    if (!gameSlug && !gameName) {
      return NextResponse.json(
        { error: 'Game slug or name is required' },
        { status: 400 }
      )
    }

    // Find the game in the database
    let game
    if (gameSlug) {
      game = await prisma.game.findFirst({
        where: { 
          OR: [
            { slug: gameSlug },
            { igdbSlug: gameSlug }
          ]
        }
      })
    } else if (gameName) {
      console.log('Searching for game:', gameName)
      
      // Try exact match first
      game = await prisma.game.findFirst({
        where: { name: gameName }
      })
      
      // If not found, try partial match
      if (!game) {
        game = await prisma.game.findFirst({
          where: { 
            name: { 
              contains: gameName, 
              mode: 'insensitive' 
            } 
          }
        })
      }
      
      // If still not found, try searching for similar names
      if (!game) {
        // For Genshin Impact, try different variations
        if (gameName.toLowerCase().includes('genshin')) {
          game = await prisma.game.findFirst({
            where: { 
              name: { 
                contains: 'Genshin',
                mode: 'insensitive' 
              } 
            }
          })
        }
      }
      
      console.log('Found game:', game)
    }

    if (!game) {
      console.log('Game not found in database:', { gameSlug, gameName })
      
      // For now, return empty players array instead of error
      // This allows the UI to show "no players found" instead of an error
      return NextResponse.json({
        players: [],
        totalPlayers: 0,
        game: null,
        message: 'Game not found in local database'
      })
    }

    // Get users who play this game - group by user to avoid duplicates
    const players = await prisma.userGame.findMany({
      where: {
        gameId: game.id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            bio: true,
            avatar: true
          }
        },
        game: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        user: {
          username: 'asc'
        }
      }
    })

    // Group by user to avoid duplicates and combine platforms
    const userMap = new Map()
    
    players.forEach(player => {
      const userId = player.user.id
      if (userMap.has(userId)) {
        // User already exists, add platform to existing entry
        const existing = userMap.get(userId)
        if (player.platform && !existing.platforms.includes(player.platform)) {
          existing.platforms.push(player.platform)
        }
      } else {
        // New user, create entry
        userMap.set(userId, {
          id: player.user.id,
          username: player.user.username,
          email: player.user.email,
          bio: player.user.bio || null,
          avatar: player.user.avatar || null,
          location: null, // Not available in current schema
          timezone: null, // Not available in current schema
          gameName: player.game.name,
          gameSlug: player.game.slug,
          platforms: player.platform ? [player.platform] : [],
          platform: player.platform || null // Keep for backward compatibility
        })
      }
    })

    // Transform the data to include only necessary information
    const transformedPlayers = Array.from(userMap.values())

    return NextResponse.json({
      players: transformedPlayers,
      totalPlayers: transformedPlayers.length,
      game: {
        id: game.id,
        name: game.name,
        slug: game.slug
      }
    })

  } catch (error) {
    console.error('Error fetching game players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch game players' },
      { status: 500 }
    )
  }
} 