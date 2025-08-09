"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Search,
  Filter,
  Star,
  Gamepad2,
  MessageCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

interface Gamer {
  id: string
  username: string
  avatar: string
  bio: string
  games: string[]
  languages: string[]
  rating: number
  hourlyRate: number
  availability: string
  tags: string[]
  isActive: boolean
  createdAt: string
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

export default function GamersPage() {
  const [gamers, setGamers] = useState<Gamer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGame, setSelectedGame] = useState("All")
  const [selectedLanguage, setSelectedLanguage] = useState("All")
  const [selectedTag, setSelectedTag] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [games, setGames] = useState<string[]>(["All"])
  const [languages, setLanguages] = useState<string[]>(["All"])
  const [tags, setTags] = useState<string[]>(["All"])
  const [stats, setStats] = useState<{totalGamers: number} | null>(null)
  const isInitialMount = useRef(true);

  // Helper function to display limited items with "+X more" indicator
  const displayLimitedItems = (items: string[], maxVisible: number = 3) => {
    if (items.length <= maxVisible) {
      return items;
    }
    return [...items.slice(0, maxVisible), `+${items.length - maxVisible} more`];
  }

  // Load filters from API
  const loadFilters = async () => {
    try {
      const response = await fetch('/api/gamers/filters')
      if (response.ok) {
        const data = await response.json()
        setGames(data.games || ["All"])
        setLanguages(data.languages || ["All"])
        setTags(data.tags || ["All"])
      }
    } catch (error) {
      console.error('Error loading filters:', error)
    }
  }

  // Fetch gamers from API
  const fetchGamers = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })
      
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim())
      }
      
      if (selectedGame !== 'All') {
        params.append('game', selectedGame)
      }
      
      if (selectedLanguage !== 'All') {
        params.append('language', selectedLanguage)
      }
      
      if (selectedTag !== 'All') {
        params.append('tag', selectedTag)
      }
      
      if (selectedStatus !== 'All') {
        params.append('status', selectedStatus)
      }
      
      const response = await fetch(`/api/gamers?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setGamers(data.gamers || [])
        setPagination(data.pagination)
        setCurrentPage(page)
        setStats({ totalGamers: data.pagination?.total || 0 })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch gamers')
      }
    } catch (error) {
      console.error('Error fetching gamers:', error)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = async (page: number = 1) => {
    await fetchGamers(page)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1) return
    fetchGamers(page)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedGame("All")
    setSelectedLanguage("All")
    setSelectedTag("All")
    setSelectedStatus("All")
    fetchGamers(1)
  }

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await loadFilters()
      await fetchGamers(1)
    }
    
    initializeData()
  }, [])

  // Reload when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!loading) {
      fetchGamers(1)
    }
  }, [selectedGame, selectedLanguage, selectedTag, selectedStatus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <section className="py-8 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <Users className="inline mr-3 h-10 w-10 text-green-400" />
                Find Gamers
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                Connect with skilled players and gaming partners
              </p>
              {stats && (
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {stats.totalGamers} gamers available
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
            <div className="mt-6 md:mt-0">
              <Button asChild size="lg" className="gaming-button">
                <Link href="/leaderboard">
                  <Trophy className="h-5 w-5 mr-2" />
                  Leaderboard
                </Link>
              </Button>
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
                <div className="relative flex items-center w-full h-10 sm:h-11 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-green-500/20 transition-all duration-300 group-hover:border-green-400/30">
                  <Search className="h-4 w-4 text-gray-400 ml-3 mr-2 group-hover:text-green-400 transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search gamers by username, bio, games, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm font-medium"
                  />
                  <div className="flex items-center gap-1 px-2 py-1 mr-3 bg-green-500/20 rounded-full border border-green-400/30">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-200 font-medium hidden sm:inline">LIVE</span>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <Button 
                onClick={() => handleSearch(1)}
                disabled={loading}
                className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 border-0 hover:scale-105 text-sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                <span>Search</span>
              </Button>
            </div>

            {/* Second Row - Filters and Clear Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 sm:gap-4 w-full">
              {/* Game Filter */}
              <div className="relative group w-full sm:w-auto" style={{width: '100%', minWidth: '250px'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center w-full h-11 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group-hover:border-purple-400/30 px-3">
                  <Gamepad2 className="h-4 w-4 text-gray-400 mr-2 group-hover:text-purple-400 transition-colors duration-200 flex-shrink-0" />
                  <select 
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-sm font-medium appearance-none cursor-pointer flex-1 min-w-0 truncate"
                  >
                    {games.map(game => (
                      <option key={game} value={game} className="bg-gray-800 text-white">{game}</option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex-shrink-0">
                    <div className="w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-t-2 border-t-gray-400 group-hover:border-t-purple-400 transition-colors duration-200"></div>
                  </div>
                </div>
              </div>

              {/* Language Filter */}
              <div className="relative group w-full sm:w-auto" style={{width: '100%', minWidth: '250px'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center w-full h-11 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group-hover:border-blue-400/30 px-3">
                  <Filter className="h-4 w-4 text-gray-400 mr-2 group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0" />
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-sm font-medium appearance-none cursor-pointer flex-1 min-w-0 truncate"
                  >
                    {languages.map(language => (
                      <option key={language} value={language} className="bg-gray-800 text-white">{language}</option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex-shrink-0">
                    <div className="w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-t-2 border-t-gray-400 group-hover:border-t-blue-400 transition-colors duration-200"></div>
                  </div>
                </div>
              </div>

              {/* Tag Filter */}
              <div className="relative group w-full sm:w-auto" style={{width: '100%', minWidth: '250px'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center w-full h-11 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group-hover:border-orange-400/30 px-3">
                  <Filter className="h-4 w-4 text-gray-400 mr-2 group-hover:text-orange-400 transition-colors duration-200 flex-shrink-0" />
                  <select 
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-sm font-medium appearance-none cursor-pointer flex-1 min-w-0 truncate"
                  >
                    {tags.map(tag => (
                      <option key={tag} value={tag} className="bg-gray-800 text-white">{tag}</option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex-shrink-0">
                    <div className="w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-t-2 border-t-gray-400 group-hover:border-t-orange-400 transition-colors duration-200"></div>
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative group w-full sm:w-auto" style={{width: '100%', minWidth: '250px'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center w-full h-11 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 group-hover:border-emerald-400/30 px-3">
                  <CheckCircle className="h-4 w-4 text-gray-400 mr-2 group-hover:text-emerald-400 transition-colors duration-200 flex-shrink-0" />
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-sm font-medium appearance-none cursor-pointer flex-1 min-w-0 truncate"
                  >
                    <option value="All" className="bg-gray-800 text-white">All Status</option>
                    <option value="active" className="bg-gray-800 text-white">Active Only</option>
                    <option value="inactive" className="bg-gray-800 text-white">Inactive Only</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex-shrink-0">
                    <div className="w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-t-2 border-t-gray-400 group-hover:border-t-emerald-400 transition-colors duration-200"></div>
                  </div>
                </div>
              </div>

              {/* Clear Button */}
              <Button 
                onClick={clearFilters}
                variant="outline"
                className="w-full sm:w-auto h-11 sm:h-12 px-4 sm:px-6 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-2xl shadow-lg transition-all duration-300 text-sm font-medium"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Results Info */}
            <div className="w-full text-center">
              <p className="text-gray-400 text-sm">
                Showing {gamers.length} of {stats?.totalGamers || 0} gamers
                {searchQuery && ` matching "${searchQuery}"`}
                {(selectedGame !== "All" || selectedLanguage !== "All" || selectedTag !== "All" || selectedStatus !== "All") && 
                  ` with selected filters`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gamers Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
              <span className="ml-3 text-white">Loading gamers...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Error loading gamers</h3>
              <p className="text-gray-400 text-center max-w-md mb-4">
                {error}
              </p>
              <Button 
                onClick={() => fetchGamers(1)}
                className="gaming-button"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : gamers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No gamers found</h3>
              <p className="text-gray-400 text-center max-w-md">
                Try adjusting your search terms or filters to find more gamers.
              </p>
              <Button 
                onClick={clearFilters}
                className="mt-4 gaming-button"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {gamers.map((gamer) => (
                  <Card 
                    key={gamer.id} 
                    className="gaming-card hover:transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-green-500/20"
                    onClick={() => window.location.href = `/profile/${gamer.username}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center flex-shrink-0">
                          {gamer.avatar ? (
                            <img 
                              src={gamer.avatar} 
                              alt={`${gamer.username}'s profile picture`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <Users className={`h-6 w-6 text-white ${gamer.avatar ? 'hidden' : ''}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white text-lg truncate">{gamer.username}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-white text-xs">{gamer.rating}</span>
                            </div>
                            {/* Account Status Badge */}
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              gamer.isActive 
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {gamer.isActive ? (
                                <>
                                  <CheckCircle className="h-2.5 w-2.5" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-2.5 w-2.5" />
                                  <span>Inactive</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-gray-300 text-sm line-clamp-2">
                        {gamer.bio}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Games */}
                      <div className="mb-3">
                        <h4 className="text-white font-semibold text-xs mb-1.5">Games:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {gamer.games.length > 0 ? (
                            displayLimitedItems([...new Set(gamer.games)], 2).map((game, index) => (
                              <Badge 
                                key={`${gamer.id}-game-${index}`} 
                                variant="secondary" 
                                className={`text-xs px-2 py-0.5 ${
                                  game.includes('+') 
                                    ? 'bg-gray-600/20 text-gray-300 border-gray-500/30' 
                                    : 'bg-green-600/20 text-green-300 border-green-500/30'
                                }`}
                              >
                                {game}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-xs">No games listed</span>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="mb-3">
                        <h4 className="text-white font-semibold text-xs mb-1.5">Languages:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {gamer.languages.length > 0 ? (
                            displayLimitedItems([...new Set(gamer.languages)], 2).map((language, index) => (
                              <Badge 
                                key={`${gamer.id}-lang-${index}`} 
                                variant="secondary" 
                                className={`text-xs px-2 py-0.5 ${
                                  language.includes('+') 
                                    ? 'bg-gray-600/20 text-gray-300 border-gray-500/30' 
                                    : 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                                }`}
                              >
                                {language}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-xs">No languages listed</span>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="mb-3">
                        <h4 className="text-white font-semibold text-xs mb-1.5">Tags:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {gamer.tags.length > 0 ? (
                            displayLimitedItems(
                              [...new Set(gamer.tags)].filter(tag => !tag.startsWith('category:')), 
                              2
                            ).map((tag, index) => (
                              <Badge 
                                key={`${gamer.id}-tag-${index}`} 
                                variant="outline" 
                                className={`text-xs px-2 py-0.5 ${
                                  tag.includes('+') 
                                    ? 'border-gray-500/30 text-gray-300' 
                                    : 'border-green-500/30 text-green-300'
                                }`}
                              >
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-xs">No tags listed</span>
                          )}
                        </div>
                      </div>


                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && (pagination.hasNext || pagination.hasPrev) && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    onClick={() => handlePageChange(pagination.prevPage || 1)}
                    disabled={!pagination.hasPrev}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <span className="text-white">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  
                  <Button
                    onClick={() => handlePageChange(pagination.nextPage || 1)}
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