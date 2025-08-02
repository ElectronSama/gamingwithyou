import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Find the game in the database
    let game = await prisma.game.findFirst({
      where: { 
        OR: [
          { slug: slug },
          { igdbSlug: slug }
        ]
      }
    })

    // If not found by slug, try to find by name
    if (!game) {
      const gameName = slug.replace(/-/g, ' ')
      game = await prisma.game.findFirst({
        where: { 
          name: { 
            contains: gameName, 
            mode: 'insensitive' 
          } 
        }
      })
    }

    if (!game) {
      return NextResponse.json({
        players: [],
        totalPlayers: 0,
        game: null,
        message: 'Game not found in local database'
      })
    }

    // Get all users who play this game
    const userGames = await prisma.userGame.findMany({
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

    // Group by user and calculate stats
    const userMap = new Map()
    
    userGames.forEach(userGame => {
      const userId = userGame.user.id
      if (userMap.has(userId)) {
        // User already exists, add platform to existing entry
        const existing = userMap.get(userId)
        if (userGame.platform && !existing.platforms.includes(userGame.platform)) {
          existing.platforms.push(userGame.platform)
        }
      } else {
        // New user, create entry
        userMap.set(userId, {
          id: userGame.user.id,
          username: userGame.user.username,
          email: userGame.user.email,
          bio: userGame.user.bio || null,
          avatar: userGame.user.avatar || null,
          gameName: userGame.game.name,
          gameSlug: userGame.game.slug,
          platforms: userGame.platform ? [userGame.platform] : [],
          level: userGame.level || 'beginner'
        })
      }
    })

    // Calculate additional stats for each user
    const playersWithStats = await Promise.all(
      Array.from(userMap.values()).map(async (player) => {
        // Get total games for this user
        const totalGames = await prisma.userGame.count({
          where: {
            userId: player.id
          }
        })

        // Calculate rating based on level and total games
        let rating = 3.0 // Base rating
        switch (player.level) {
          case 'expert':
            rating += 2.0
            break
          case 'advanced':
            rating += 1.5
            break
          case 'intermediate':
            rating += 1.0
            break
          case 'beginner':
            rating += 0.5
            break
        }

        // Bonus for having more games
        if (totalGames > 10) rating += 1.0
        else if (totalGames > 5) rating += 0.5
        else if (totalGames > 1) rating += 0.2

        // Cap rating at 5.0
        rating = Math.min(rating, 5.0)

        return {
          ...player,
          rating: parseFloat(rating.toFixed(1)),
          totalGames,
          rank: 0 // Will be calculated after sorting
        }
      })
    )

    // Sort by rating (highest first) and assign ranks
    const sortedPlayers = playersWithStats
      .sort((a, b) => b.rating - a.rating)
      .map((player, index) => ({
        ...player,
        rank: index + 1
      }))

    return NextResponse.json({
      players: sortedPlayers,
      totalPlayers: sortedPlayers.length,
      game: {
        id: game.id,
        name: game.name,
        slug: game.slug
      }
    })

  } catch (error) {
    console.error('Error fetching game leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch game leaderboard' },
      { status: 500 }
    )
  }
} 