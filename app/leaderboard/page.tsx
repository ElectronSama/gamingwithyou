"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy,
  Star,
  Users,
  Crown,
  Medal,
  Award,
  Filter,
  Search,
  Gamepad2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  TrendingUp,
  Target
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface LeaderboardUser {
  id: string
  username: string
  email: string
  bio: string | null
  avatar: string | null
  rating: number
  totalGames: number
  totalPlatforms: number
  platforms: string[]
  games: string[]
  rank: number
  totalReviews: number
  averageRating: number
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'rating' | 'games' | 'platforms' | 'reviews'>('rating')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/leaderboard')
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to load leaderboard')
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setError('Failed to load leaderboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // Get unique categories for filtering
  const categories = ['all', 'top-rated', 'most-games', 'multi-platform', 'most-reviewed']

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      // Search filter
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Category filter
      let matchesCategory = true
      switch (selectedCategory) {
        case 'top-rated':
          matchesCategory = user.rating >= 4.0
          break
        case 'most-games':
          matchesCategory = user.totalGames >= 5
          break
        case 'multi-platform':
          matchesCategory = user.totalPlatforms >= 2
          break
        case 'most-reviewed':
          matchesCategory = user.totalReviews >= 3
          break
        default:
          matchesCategory = true
      }
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'games':
          return b.totalGames - a.totalGames
        case 'platforms':
          return b.totalPlatforms - a.totalPlatforms
        case 'reviews':
          return b.totalReviews - a.totalReviews
        default:
          return 0
      }
    })

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-300" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="text-gray-400 font-semibold text-lg">{rank}</span>
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'top-rated':
        return <Star className="h-4 w-4" />
      case 'most-games':
        return <Gamepad2 className="h-4 w-4" />
      case 'multi-platform':
        return <Target className="h-4 w-4" />
      case 'most-reviewed':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Trophy className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-400" />
            <span className="ml-3 text-white">Loading leaderboard...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Leaderboard</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button asChild className="gaming-button">
              <Link href="/gamers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Gamers
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <section className="py-8 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/gamers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Gamers
              </Link>
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Trophy className="h-12 w-12 text-yellow-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Global Leaderboard
              </h1>
            </div>
            <p className="text-xl text-gray-300">
              Top gamers ranked by ratings, games, and platforms
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                onClick={() => setSortBy('rating')}
                className="gaming-button"
              >
                <Star className="h-4 w-4 mr-2" />
                By Rating
              </Button>
              <Button
                variant={sortBy === 'games' ? 'default' : 'outline'}
                onClick={() => setSortBy('games')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Gamepad2 className="h-4 w-4 mr-2" />
                By Games
              </Button>
              <Button
                variant={sortBy === 'platforms' ? 'default' : 'outline'}
                onClick={() => setSortBy('platforms')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Target className="h-4 w-4 mr-2" />
                By Platforms
              </Button>
              <Button
                variant={sortBy === 'reviews' ? 'default' : 'outline'}
                onClick={() => setSortBy('reviews')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                By Reviews
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "gaming-button" : "border-white/20 text-white hover:bg-white/10"}
              >
                {getCategoryIcon(category)}
                <span className="ml-2 capitalize">
                  {category === 'all' ? 'All Players' : 
                   category === 'top-rated' ? 'Top Rated' :
                   category === 'most-games' ? 'Most Games' :
                   category === 'multi-platform' ? 'Multi Platform' :
                   'Most Reviewed'}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredAndSortedUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedUsers.map((user, index) => (
                <Card key={user.id} className="gaming-card hover:transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full">
                        {getRankIcon(index + 1)}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold text-xl">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold text-white">{user.username}</h3>
                            {user.bio && (
                              <p className="text-gray-400 text-sm line-clamp-1">{user.bio}</p>
                            )}
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <div>
                              <span className="text-white font-semibold">{user.rating.toFixed(1)}</span>
                              <span className="text-gray-400 text-sm ml-1">rating</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Gamepad2 className="h-4 w-4 text-green-400" />
                            <div>
                              <span className="text-white font-semibold">{user.totalGames}</span>
                              <span className="text-gray-400 text-sm ml-1">games</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-400" />
                            <div>
                              <span className="text-white font-semibold">{user.totalPlatforms}</span>
                              <span className="text-gray-400 text-sm ml-1">platforms</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-purple-400" />
                            <div>
                              <span className="text-white font-semibold">{user.totalReviews}</span>
                              <span className="text-gray-400 text-sm ml-1">reviews</span>
                            </div>
                          </div>
                        </div>

                        {/* Platforms and Games */}
                        <div className="mt-4 space-y-2">
                          {user.platforms && user.platforms.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">Platforms:</span>
                              <div className="flex flex-wrap gap-1">
                                {user.platforms.slice(0, 5).map((platform, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs">
                                    {platform}
                                  </Badge>
                                ))}
                                {user.platforms.length > 5 && (
                                  <Badge variant="outline" className="border-gray-500/30 text-gray-400 text-xs">
                                    +{user.platforms.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {user.games && user.games.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">Top Games:</span>
                              <div className="flex flex-wrap gap-1">
                                {user.games.slice(0, 3).map((game, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30 text-xs">
                                    {game}
                                  </Badge>
                                ))}
                                {user.games.length > 3 && (
                                  <Badge variant="outline" className="border-gray-500/30 text-gray-400 text-xs">
                                    +{user.games.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button asChild className="gaming-button">
                          <Link href={`/profile/${user.username}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Link href={`/profile/${user.username}`}>
                            Message
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="gaming-card">
              <CardContent className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Players Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? `No players match your search criteria${searchTerm ? ' and' : ''}${selectedCategory !== 'all' ? ` category filter (${selectedCategory})` : ''}.` 
                    : 'No players available in the leaderboard.'}
                </p>
                <Button asChild className="gaming-button">
                  <Link href="/gamers">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Gamers
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
} 