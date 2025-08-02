"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Trophy,
  Star,
  Users,
  Crown,
  Medal,
  Award,
  Filter,
  Search,
  Loader2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface Game {
  id: number
  name: string
  slug: string
  cover?: { url: string } | null
}

interface LeaderboardPlayer {
  id: string
  username: string
  email: string
  bio: string | null
  avatar: string | null
  gameName: string
  gameSlug: string
  platforms: string[]
  rating: number
  totalGames: number
  rank: number
}

export default function GameLeaderboardPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [game, setGame] = useState<Game | null>(null)
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'rating' | 'games' | 'name'>('rating')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')

  useEffect(() => {
    const fetchGameAndPlayers = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Fetch game details
        const gameResponse = await fetch(`/api/igdb/game/${slug}`)
        if (gameResponse.ok) {
          const gameData = await gameResponse.json()
          setGame(gameData.game)
        }
        
        // Fetch leaderboard data
        const leaderboardResponse = await fetch(`/api/games/${slug}/leaderboard`)
        if (leaderboardResponse.ok) {
          const leaderboardData = await leaderboardResponse.json()
          setPlayers(leaderboardData.players || [])
        } else {
          const errorData = await leaderboardResponse.json()
          setError(errorData.error || 'Failed to load leaderboard')
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setError('Failed to load leaderboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchGameAndPlayers()
  }, [slug])

  // Get unique platforms from all players
  const allPlatforms = Array.from(
    new Set(
      players.flatMap(player => player.platforms || [])
    )
  ).sort()

  // Filter and sort players
  const filteredAndSortedPlayers = players
    .filter(player => {
      // Search filter
      const matchesSearch = 
        player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Platform filter
      const matchesPlatform = 
        selectedPlatform === 'all' || 
        (player.platforms && player.platforms.includes(selectedPlatform))
      
      return matchesSearch && matchesPlatform
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'games':
          return b.totalGames - a.totalGames
        case 'name':
          return a.username.localeCompare(b.username)
        default:
          return 0
      }
    })

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <span className="text-gray-400 font-semibold">{rank}</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-400" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Leaderboard</h3>
            <p className="text-gray-400 mb-4">{error || 'Game not found'}</p>
            <Button asChild className="gaming-button">
              <Link href="/games">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
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
              <Link href={`/games/${slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Game
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-6 mb-8">
            {/* Game Cover */}
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-xl overflow-hidden shadow-2xl">
              {game.cover?.url ? (
                <img 
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/').pop()}`}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            
            {/* Game Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {game.name} Leaderboard
              </h1>
              <p className="text-gray-400">
                Top players and their achievements
              </p>
            </div>
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
                <Users className="h-4 w-4 mr-2" />
                By Games
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                onClick={() => setSortBy('name')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Filter className="h-4 w-4 mr-2" />
                By Name
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Filter */}
      {allPlatforms.length > 0 && (
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedPlatform === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedPlatform('all')}
                className="gaming-button"
              >
                All Platforms
              </Button>
              {allPlatforms.map((platform) => (
                <Button
                  key={platform}
                  variant={selectedPlatform === platform ? 'default' : 'outline'}
                  onClick={() => setSelectedPlatform(platform)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Leaderboard */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredAndSortedPlayers.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedPlayers.map((player, index) => (
                <Card key={player.id} className="gaming-card hover:transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full">
                        {getRankIcon(index + 1)}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                            {player.avatar ? (
                              <img 
                                src={player.avatar} 
                                alt={player.username}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold text-lg">
                                {player.username.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{player.username}</h3>
                            {player.bio && (
                              <p className="text-gray-400 text-sm line-clamp-1">{player.bio}</p>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-white font-semibold">{player.rating.toFixed(1)}</span>
                            <span className="text-gray-400 text-sm">rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span className="text-white font-semibold">{player.totalGames}</span>
                            <span className="text-gray-400 text-sm">games</span>
                          </div>
                          {player.platforms && player.platforms.length > 0 && (
                            <div className="flex items-center gap-2">
                              {player.platforms.map((platform, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button asChild className="gaming-button">
                          <Link href={`/profile/${player.username}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Link href={`/profile/${player.username}`}>
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
                  {searchTerm || selectedPlatform !== 'all' 
                    ? `No players match your search criteria${searchTerm ? ' and' : ''}${selectedPlatform !== 'all' ? ` platform filter (${selectedPlatform})` : ''}.` 
                    : 'No players have joined this game yet.'}
                </p>
                <Button asChild className="gaming-button">
                  <Link href={`/games/${slug}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Game
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