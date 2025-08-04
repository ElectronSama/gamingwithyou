import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Fetch all users with basic data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        userGames: {
          include: {
            game: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform users into leaderboard format
    const leaderboardUsers = users.map(user => {
      // Get unique games
      const uniqueGames = Array.from(new Set(
        user.userGames.map((ug: any) => ug.game.name)
      ))

      // Get unique platforms
      const uniquePlatforms = Array.from(new Set(
        user.userGames
          .map((ug: any) => ug.platform)
          .filter(Boolean)
      ))

      // Get user's top games (first 3)
      const topGames = uniqueGames.slice(0, 3)

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        rating: 3.5, // Default rating for now
        totalGames: uniqueGames.length,
        totalPlatforms: uniquePlatforms.length,
        platforms: uniquePlatforms,
        games: topGames,
        totalReviews: 0, // Default for now
        averageRating: 3.5
      }
    })

    // Sort by number of games (highest first)
    const sortedUsers = leaderboardUsers
      .filter(user => user.totalGames > 0) // Only include users with games
      .sort((a, b) => {
        // Primary sort by number of games
        if (b.totalGames !== a.totalGames) {
          return b.totalGames - a.totalGames
        }
        // Secondary sort by number of platforms
        if (b.totalPlatforms !== a.totalPlatforms) {
          return b.totalPlatforms - a.totalPlatforms
        }
        // Tertiary sort by username
        return a.username.localeCompare(b.username)
      })

    // Add rank to each user
    const rankedUsers = sortedUsers.map((user, index) => ({
      ...user,
      rank: index + 1
    }))

    return NextResponse.json({
      success: true,
      users: rankedUsers,
      total: rankedUsers.length
    })

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch leaderboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 