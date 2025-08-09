"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Gamepad2, 
  Star,
  Calendar,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Trophy
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface Game {
  id: number
  name: string
  slug: string
  summary?: string | null
  storyline?: string | null
  rating?: number | null
  rating_count?: number | null
  first_release_date?: number | null
  cover?: { url: string } | null
  genres?: Array<{ id: number; name: string }>
  platforms?: Array<{ id: number; name: string }>
  screenshots?: Array<{ url: string }>
  videos?: Array<{ video_id: string }>
  websites?: Array<{ category: number; url: string }>
  similar_games?: Array<{ id: number; name: string; cover?: { url: string } }>
  dlcs?: Array<{ id: number; name: string; cover?: { url: string } }>
  expansions?: Array<{ id: number; name: string; cover?: { url: string } }>
  game_modes?: Array<{ id: number; name: string }>
  player_perspectives?: Array<{ id: number; name: string }>
  age_ratings?: Array<{ category: number; rating: number }>
}

interface Player {
  id: string;
  username: string;
  avatar?: string | null;
  rating?: number;
}

export default function GameDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [players, setPlayers] = useState<Player[]>([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [playersError, setPlayersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/igdb/game/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setGame(data.game)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Game not found')
        }
      } catch (error) {
        console.error('Error fetching game:', error)
        setError('Failed to load game details')
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [slug])

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!game?.name) return;

      try {
        setPlayersLoading(true);
        setPlayersError(null);

        const response = await fetch(`/api/gamers?game=${encodeURIComponent(game.name)}`);
        if (response.ok) {
          const data = await response.json();
          setPlayers(data.gamers);
        } else {
          const errorData = await response.json();
          setPlayersError(errorData.error || 'Failed to fetch players');
        }
      } catch (error) {
        console.error('Error fetching players:', error);
        setPlayersError('Failed to load players');
      } finally {
        setPlayersLoading(false);
      }
    };

    if (game) {
      fetchPlayers();
    }
  }, [game]);

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
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Game</h3>
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
      <section className="py-6 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/games">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Game Cover */}
            <div className="lg:col-span-1">
              <div className="w-1/2 mx-auto lg:w-full aspect-[3/4] bg-gradient-to-br from-green-600 to-green-700 rounded-2xl overflow-hidden shadow-2xl">
                {game.cover?.url ? (
                  <img 
                    src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/').pop()}`}
                    alt={game.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gamepad2 className="h-24 w-24 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Game Info */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {game.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-4">
                    {game.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold text-base">
                          {game.rating.toFixed(1)}
                        </span>
                        {game.rating_count && (
                          <span className="text-gray-400 text-xs">
                            ({game.rating_count} ratings)
                          </span>
                        )}
                      </div>
                    )}
                    
                    {game.first_release_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="text-white text-base">
                          {new Date(game.first_release_date * 1000).getFullYear()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {game.genres?.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30">
                      {genre.name}
                    </Badge>
                  ))}
                  {game.platforms?.map((platform, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                      {platform.name}
                    </Badge>
                  ))}
                  {game.game_modes?.map((mode, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                      {mode.name}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button asChild className="gaming-button">
                    <Link href={`/games/${slug}/leaderboard`}>
                      <Trophy className="h-4 w-4 mr-2" />
                      Leaderboard
                    </Link>
                  </Button>
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-bold text-white mb-3">About {game.name}</h2>
                  {game.summary ? (
                    <p className="text-gray-400 leading-normal text-sm">
                      {game.summary}
                    </p>
                  ) : game.storyline ? (
                    <p className="text-gray-400 leading-normal text-sm">
                      {game.storyline}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">No description available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mt-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Players</CardTitle>
            </CardHeader>
            <CardContent>
              {playersLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-400" />
                </div>
              ) : playersError ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Error Loading Players</h3>
                  <p className="text-gray-400">{playersError}</p>
                </div>
              ) : players.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {players.map((player) => (
                    <Link href={`/profile/${player.username}`} key={player.id}>
                      <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <img
                            src={player.avatar || '/default-avatar.png'}
                            alt={player.username}
                            className="w-24 h-24 rounded-full object-cover mb-4"
                            onError={(e) => {
                              e.currentTarget.src = '/default-avatar.png';
                            }}
                          />
                          <h4 className="text-lg font-semibold text-white">{player.username}</h4>
                          {player.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-300">{player.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No players found for this game yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
