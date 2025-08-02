"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Gamepad2, 
  Search,
  Filter,
  Star,
  Users,
  Calendar,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Game {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  genre?: string | null
  platform?: string | null
  rating?: number | null
  releaseDate?: Date | null
  igdbRating?: number | null
  igdbRatingCount?: number | null
  igdbCoverUrl?: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedPlatform, setSelectedPlatform] = useState("All")
  const [syncing, setSyncing] = useState(false)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [genres, setGenres] = useState<string[]>(["All"])
  const [platforms, setPlatforms] = useState<string[]>(["All"])
  const [stats, setStats] = useState<{totalGames: number, databaseName: string} | null>(null)

  useEffect(() => {
    const initializeGames = async () => {
      try {
        // Use IGDB API directly for full game collection access
        const response = await fetch('/api/igdb/games?page=1&limit=12')
        const data = await response.json()
        
        if (data.games && data.games.length > 0) {
          setGames(data.games || [])
          setPagination(data.pagination)
          setCurrentPage(1)
          setLoading(false)
        } else {
          setError('No games found from IGDB')
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing games:', error)
        setError('Failed to load games from IGDB')
        setLoading(false)
      }
    }

    const loadFilters = async () => {
      try {
        // Load genres from IGDB
        const genresResponse = await fetch('/api/igdb/genres')
        if (genresResponse.ok) {
          const genresData = await genresResponse.json()
          setGenres(["All", ...genresData.genres.map((g: any) => g.name)])
        }

        // Load platforms from IGDB
        const platformsResponse = await fetch('/api/igdb/platforms')
        if (platformsResponse.ok) {
          const platformsData = await platformsResponse.json()
          setPlatforms(["All", ...platformsData.platforms.map((p: any) => p.name)])
        }
      } catch (error) {
        console.error('Error loading filters:', error)
        // Fallback to default filters if IGDB fails
        setGenres(["All", "MOBA", "FPS", "Battle Royale", "Sandbox", "RPG", "Strategy", "Action", "Adventure", "Sports"])
        setPlatforms(["All", "PC", "Console", "Mobile", "Multi-platform"])
      }
    }

    const loadStats = async () => {
      try {
        const statsResponse = await fetch('/api/igdb/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    initializeGames()
    loadFilters()
    loadStats()
  }, [])

  const fetchGames = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })
      
      if (selectedGenre !== 'All') {
        params.append('genre', selectedGenre)
      }
      
      if (selectedPlatform !== 'All') {
        params.append('platform', selectedPlatform)
      }
      
      const response = await fetch(`/api/igdb/games?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        console.log('IGDB Games API response:', data)
        setGames(data.games || [])
        setPagination(data.pagination)
        setCurrentPage(page)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch games from IGDB')
      }
    } catch (error) {
      console.error('Error fetching games:', error)
      setError('Failed to connect to IGDB')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (page: number = 1) => {
    if (!searchQuery.trim()) {
      fetchGames(page)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        limit: '12'
      })
      
      if (selectedGenre !== 'All') {
        params.append('genre', selectedGenre)
      }
      
      if (selectedPlatform !== 'All') {
        params.append('platform', selectedPlatform)
      }
      
      const response = await fetch(`/api/igdb/games?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setGames(data.games || [])
        setPagination(data.pagination)
        setCurrentPage(page)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to search games in IGDB')
      }
    } catch (error) {
      console.error('Error searching games:', error)
      setError('Failed to connect to IGDB')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    
    if (searchQuery.trim()) {
      handleSearch(page)
    } else {
      fetchGames(page)
    }
  }

  // Reload games when filters change
  useEffect(() => {
    if (!loading) {
      if (searchQuery.trim()) {
        handleSearch(1)
      } else {
        fetchGames(1)
      }
    }
  }, [selectedGenre, selectedPlatform])

  // Remove client-side filtering since we're now filtering on the server
  const filteredGames = games

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <section className="py-8 bg-black/20">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <Gamepad2 className="inline mr-3 h-10 w-10 text-green-400" />
                Games Library
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                Explore main games from the complete IGDB database
              </p>
              {stats && (
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Gamepad2 className="h-4 w-4" />
                    {stats.totalGames.toLocaleString()} games available
                  </span>
                  <span className="flex items-center gap-1">
                    <Search className="h-4 w-4" />
                    Real-time search
                  </span>
                  <span className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Advanced filtering
                  </span>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-start gap-4 lg:gap-6" style={{minHeight: '200px', width: '100%', justifyContent: 'center'}}>
            
            {/* First Row - Search Bar and Search Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 lg:gap-6 w-full">
              {/* Search Bar */}
              <div className="relative group w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center w-full h-12 sm:h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-green-500/20 transition-all duration-300 group-hover:border-green-400/30">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 ml-3 sm:ml-4 mr-2 sm:mr-3 group-hover:text-green-400 transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base font-medium"
                  />
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 mr-3 sm:mr-4 bg-green-500/20 rounded-full border border-green-400/30">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-200 font-medium hidden sm:inline">IGDB</span>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <Button 
                onClick={() => handleSearch(1)}
                disabled={loading}
                className="w-full sm:w-auto h-12 sm:h-14 px-4 sm:px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 border-0 hover:scale-105 text-sm sm:text-base"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-1 sm:mr-2" />
                ) : (
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                )}
                <span>Search</span>
              </Button>
            </div>

            {/* Second Row - Filters and Clear Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 sm:gap-4 w-full">
              {/* Genre Filter */}
              <div className="relative group w-full sm:w-auto" style={{width: '100%', minWidth: '250px'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center w-full h-11 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group-hover:border-purple-400/30 px-3">
                  <Filter className="h-4 w-4 text-gray-400 mr-2 group-hover:text-purple-400 transition-colors duration-200 flex-shrink-0" />
                  <select 
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-sm font-medium appearance-none cursor-pointer flex-1 min-w-0 truncate"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre} className="bg-gray-800 text-white">{genre}</option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex-shrink-0">
                    <div className="w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-t-2 border-t-gray-400 group-hover:border-t-purple-400 transition-colors duration-200"></div>
                  </div>
                </div>
              </div>

              {/* Platform Filter */}
              <div className="relative group w-full sm:w-auto" style={{width: '100%', minWidth: '250px'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center w-full h-11 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group-hover:border-blue-400/30 px-3">
                  <Filter className="h-4 w-4 text-gray-400 mr-2 group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0" />
                  <select 
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-sm font-medium appearance-none cursor-pointer flex-1 min-w-0 truncate"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform} className="bg-gray-800 text-white">{platform}</option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex-shrink-0">
                    <div className="w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-t-2 border-t-gray-400 group-hover:border-t-blue-400 transition-colors duration-200"></div>
                  </div>
                </div>
              </div>

              {/* Clear Button */}
              <Button 
                onClick={() => {
                  setSelectedGenre("All")
                  setSelectedPlatform("All")
                  setSearchQuery("")
                  fetchGames(1)
                }} 
                className="w-full sm:w-auto h-11 sm:h-12 px-4 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-red-500/30 transition-all duration-300 border-0 hover:scale-105 text-sm"
              >
                <span>Clear</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Error Loading Games</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <Button onClick={() => fetchGames(1)} className="gaming-button">
                Try Again
              </Button>
            </div>
          ) : games.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Gamepad2 className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Games Found</h3>
              <p className="text-gray-400 mb-4 text-center">
                {syncing ? 'Syncing games from IGDB...' : 'No games match your current search criteria or filters.'}
              </p>
              {syncing && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-green-400" />
                  <span className="text-green-400">Syncing from IGDB...</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGames.map((game) => (
                  <Card key={game.id} className="gaming-card hover:transform hover:scale-105 transition-all duration-300 flex flex-col h-full">
                    <CardHeader className="flex-shrink-0">
                      <div className="aspect-video bg-gradient-to-br from-green-600 to-green-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {game.igdbCoverUrl ? (
                          <img 
                            src={game.igdbCoverUrl} 
                            alt={game.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(`Failed to load image for ${game.name}:`, game.igdbCoverUrl);
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log(`Successfully loaded image for ${game.name}:`, game.igdbCoverUrl);
                            }}
                          />
                        ) : (
                          <Gamepad2 className="h-16 w-16 text-white" />
                        )}
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-white text-xl line-clamp-2">{game.name}</CardTitle>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white text-sm">
                            {game.igdbRating ? game.igdbRating.toFixed(1) : game.rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        {game.igdbRatingCount && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{game.igdbRatingCount} ratings</span>
                          </div>
                        )}
                        {game.releaseDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(game.releaseDate).getFullYear()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <Button asChild className="flex-1 gaming-button">
                          <Link href={`/games/${game.slug}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                          <Link href={`/games/${game.slug}`}>
                            Find Players
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    onClick={() => handlePageChange(pagination.prevPage!)}
                    disabled={!pagination.hasPrev}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                    <span className="text-white font-medium">
                      Page {pagination.page}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handlePageChange(pagination.nextPage!)}
                    disabled={!pagination.hasNext}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
} 