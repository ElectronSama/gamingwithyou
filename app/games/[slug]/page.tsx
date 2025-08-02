"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Gamepad2, 
  Star,
  Users,
  Calendar,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Play,
  MessageCircle,
  Users as PlayersIcon,
  Globe,
  Video,
  Image as ImageIcon,
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

export default function GameDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [players, setPlayers] = useState<any[]>([])
  const [playersLoading, setPlayersLoading] = useState(false)

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

  // Fetch players when tab changes to players
  useEffect(() => {
    const fetchPlayers = async () => {
      if (activeTab === "players" && game) {
        try {
          setPlayersLoading(true)
          console.log('Fetching players for game:', game.name)
          const response = await fetch(`/api/games/players?gameName=${encodeURIComponent(game.name)}`)
          console.log('API response status:', response.status)
          
          if (response.ok) {
            const data = await response.json()
            console.log('Players data:', data)
            setPlayers(data.players || [])
          } else {
            const errorData = await response.json()
            console.error('Failed to fetch players:', errorData)
            setPlayers([]) // Set empty array on error
          }
        } catch (error) {
          console.error('Error fetching players:', error)
          setPlayers([]) // Set empty array on network error
        } finally {
          setPlayersLoading(false)
        }
      }
    }

    fetchPlayers()
  }, [activeTab, game])

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
      <section className="py-8 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/games">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Game Cover */}
                         <div className="lg:col-span-1">
               <div className="aspect-[3/4] bg-gradient-to-br from-green-600 to-green-700 rounded-2xl overflow-hidden shadow-2xl">
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
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {game.name}
                  </h1>
                  
                                     <div className="flex items-center gap-4 mb-6">
                     {game.rating && (
                       <div className="flex items-center gap-2">
                         <Star className="h-5 w-5 text-yellow-400 fill-current" />
                         <span className="text-white font-semibold text-lg">
                           {game.rating.toFixed(1)}
                         </span>
                         {game.rating_count && (
                           <span className="text-gray-400 text-sm">
                             ({game.rating_count} ratings)
                           </span>
                         )}
                       </div>
                     )}
                     
                     {game.first_release_date && (
                       <div className="flex items-center gap-2">
                         <Calendar className="h-5 w-5 text-blue-400" />
                         <span className="text-white">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-green-600">
                Overview
              </TabsTrigger>
              <TabsTrigger value="media" className="text-white data-[state=active]:bg-green-600">
                Media
              </TabsTrigger>
              <TabsTrigger value="related" className="text-white data-[state=active]:bg-green-600">
                Related
              </TabsTrigger>
              <TabsTrigger value="players" className="text-white data-[state=active]:bg-green-600">
                Players
              </TabsTrigger>
              <TabsTrigger value="community" className="text-white data-[state=active]:bg-green-600">
                Community
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white">About {game.name}</CardTitle>
                    </CardHeader>
                                         <CardContent>
                       {game.summary ? (
                         <p className="text-gray-300 leading-relaxed">
                           {game.summary}
                         </p>
                       ) : game.storyline ? (
                         <p className="text-gray-300 leading-relaxed">
                           {game.storyline}
                         </p>
                       ) : (
                         <p className="text-gray-400 italic">No description available.</p>
                       )}
                     </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Game Details */}
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white">Game Details</CardTitle>
                    </CardHeader>
                                         <CardContent className="space-y-4">
                       {game.first_release_date && (
                         <div className="flex justify-between">
                           <span className="text-gray-400">Release Date</span>
                           <span className="text-white">{new Date(game.first_release_date * 1000).toLocaleDateString()}</span>
                         </div>
                       )}
                       {game.genres && game.genres.length > 0 && (
                         <div className="flex justify-between">
                           <span className="text-gray-400">Genres</span>
                           <span className="text-white">{game.genres.map(genre => genre.name).join(', ')}</span>
                         </div>
                       )}
                       {game.platforms && game.platforms.length > 0 && (
                         <div className="flex justify-between">
                           <span className="text-gray-400">Platforms</span>
                           <span className="text-white">{game.platforms.map(platform => platform.name).join(', ')}</span>
                         </div>
                       )}
                       {game.game_modes && game.game_modes.length > 0 && (
                         <div className="flex justify-between">
                           <span className="text-gray-400">Game Modes</span>
                           <span className="text-white">{game.game_modes.map(mode => mode.name).join(', ')}</span>
                         </div>
                       )}
                     </CardContent>
                  </Card>

                                     {/* Rating */}
                   {game.rating && (
                     <Card className="gaming-card">
                       <CardHeader>
                         <CardTitle className="text-white">Rating</CardTitle>
                       </CardHeader>
                       <CardContent>
                         <div className="flex items-center gap-3">
                           <div className="text-3xl font-bold text-yellow-400">
                             {game.rating.toFixed(1)}
                           </div>
                           <div>
                             <div className="flex items-center gap-1">
                               {[...Array(5)].map((_, i) => (
                                 <Star 
                                   key={i} 
                                   className={`h-4 w-4 ${i < Math.floor(game.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                 />
                               ))}
                             </div>
                             {game.rating_count && (
                               <p className="text-gray-400 text-sm mt-1">
                                 {game.rating_count} ratings
                               </p>
                             )}
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   )}
                </div>
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="mt-8">
              <div className="space-y-8">
                {/* Screenshots */}
                {game.screenshots && game.screenshots.length > 0 && (
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Screenshots
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {game.screenshots.map((screenshot, index) => (
                          <div key={index} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                            <img 
                              src={`https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${screenshot.url.split('/').pop()}`}
                              alt={`${game.name} screenshot ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Videos */}
                {game.videos && game.videos.length > 0 && (
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Videos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {game.videos.map((video, index) => (
                          <div key={index} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${video.video_id}`}
                              title={`${game.name} video ${index + 1}`}
                              className="w-full h-full"
                              allowFullScreen
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(!game.screenshots || game.screenshots.length === 0) && 
                 (!game.videos || game.videos.length === 0) && (
                  <Card className="gaming-card">
                    <CardContent className="text-center py-8">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No media available for this game.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Related Tab */}
            <TabsContent value="related" className="mt-8">
              <div className="space-y-8">
                {/* Similar Games */}
                {game.similar_games && game.similar_games.length > 0 && (
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white">Similar Games</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {game.similar_games.slice(0, 6).map((similarGame) => (
                          <Card key={similarGame.id} className="gaming-card hover:transform hover:scale-105 transition-all duration-300">
                            <CardHeader>
                              <div className="aspect-video bg-gradient-to-br from-green-600 to-green-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                {similarGame.cover?.url ? (
                                  <img 
                                    src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${similarGame.cover.url.split('/').pop()}`}
                                    alt={similarGame.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Gamepad2 className="h-12 w-12 text-white" />
                                )}
                              </div>
                              <CardTitle className="text-white text-lg">{similarGame.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Button asChild className="w-full gaming-button">
                                <Link href={`/games/${similarGame.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                  View Game
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* DLCs and Expansions */}
                {(game.dlcs && game.dlcs.length > 0) || (game.expansions && game.expansions.length > 0) ? (
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white">DLCs & Expansions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...(game.dlcs || []), ...(game.expansions || [])].slice(0, 6).map((item) => (
                          <Card key={item.id} className="gaming-card hover:transform hover:scale-105 transition-all duration-300">
                            <CardHeader>
                              <div className="aspect-video bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                {item.cover?.url ? (
                                  <img 
                                    src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${item.cover.url.split('/').pop()}`}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Gamepad2 className="h-12 w-12 text-white" />
                                )}
                              </div>
                              <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Button asChild className="w-full gaming-button">
                                <Link href={`/games/${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                  View DLC
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="gaming-card">
                    <CardContent className="text-center py-8">
                      <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No DLCs or expansions available.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

                         {/* Players Tab */}
             <TabsContent value="players" className="mt-8">
               <div className="space-y-8">
                 {playersLoading ? (
                   <div className="flex justify-center items-center py-12">
                     <Loader2 className="h-8 w-8 animate-spin text-green-400" />
                   </div>
                                   ) : players.length > 0 ? (
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <PlayersIcon className="h-5 w-5" />
                        Players ({players.length})
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Users who are playing {game.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {players.map((player) => (
                          <Card key={player.id} className="gaming-card hover:transform hover:scale-105 transition-all duration-300">
                            <CardHeader>
                              <div className="flex items-center gap-4">
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
                                <div className="flex-1">
                                  <CardTitle className="text-white text-lg">{player.username}</CardTitle>
                                  {player.location && (
                                    <p className="text-gray-400 text-sm">{player.location}</p>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {player.bio && (
                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                  {player.bio}
                                </p>
                              )}
                                                             {player.platforms && player.platforms.length > 0 && (
                                 <div className="flex items-center gap-2 mb-4">
                                   {player.platforms.map((platform, index) => (
                                     <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                                       {platform}
                                     </Badge>
                                   ))}
                                 </div>
                               )}
                              <div className="flex gap-2">
                                <Button asChild className="flex-1 gaming-button">
                                  <Link href={`/profile/${player.username}`}>
                                    View Profile
                                  </Link>
                                </Button>
                                <Button asChild variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                                  <Link href={`/profile/${player.username}`}>
                                    Message
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                                 ) : (
                   <Card className="gaming-card">
                     <CardContent className="text-center py-12">
                       <PlayersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                       <h3 className="text-xl font-semibold text-white mb-2">Players Feature Coming Soon</h3>
                       <p className="text-gray-400 mb-6">
                         This feature is currently under development. Soon you'll be able to see other players who are playing {game.name}.
                       </p>
                       <div className="space-y-4">
                         <Button className="gaming-button">
                           <Users className="h-4 w-4 mr-2" />
                           Add Game to Profile
                         </Button>
                         <div className="text-sm text-gray-500">
                           <p>• Connect your gaming profiles</p>
                           <p>• Find players for multiplayer games</p>
                           <p>• Join gaming communities</p>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 )}
              </div>
            </TabsContent>

            {/* Community Tab */}
            <TabsContent value="community" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Find Players */}
                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <PlayersIcon className="h-5 w-5" />
                      Find Players
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Connect with other players who are playing {game.name}.
                    </p>
                    <Button className="gaming-button w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Browse Players
                    </Button>
                  </CardContent>
                </Card>

                {/* Discussion */}
                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Discussion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Join the conversation about {game.name}.
                    </p>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Discussion
                    </Button>
                  </CardContent>
                </Card>

                {/* External Links */}
                {game.websites && game.websites.length > 0 && (
                  <Card className="gaming-card lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        External Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {game.websites.map((website, index) => (
                          <Button 
                            key={index} 
                            variant="outline" 
                            className="border-white/20 text-white hover:bg-white/10 justify-start"
                            asChild
                          >
                            <a href={website.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {website.category === 1 ? 'Official Website' :
                               website.category === 2 ? 'Wikia' :
                               website.category === 3 ? 'Wikipedia' :
                               website.category === 4 ? 'Facebook' :
                               website.category === 5 ? 'Twitter' :
                               website.category === 6 ? 'Twitch' :
                               website.category === 8 ? 'Instagram' :
                               website.category === 9 ? 'YouTube' :
                               website.category === 13 ? 'Steam' :
                               website.category === 14 ? 'Reddit' :
                               'External Link'}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
} 