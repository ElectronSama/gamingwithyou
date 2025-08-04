"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Search,
  Gamepad2,
  Monitor,
  X
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function CreateServicePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    gameId: '',
    gameName: '',
    platformId: '',
    platformName: ''
  })

  const [gameSearch, setGameSearch] = useState('')
  const [gameSearchResults, setGameSearchResults] = useState<any[]>([])
  const [gameSearchLoading, setGameSearchLoading] = useState(false)
  const [showGameSearch, setShowGameSearch] = useState(false)
  
  const [gamePlatforms, setGamePlatforms] = useState<any[]>([])
  const [showGamePlatformSelect, setShowGamePlatformSelect] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/profile/services/dashboard')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create service')
      }
    } catch (error) {
      console.error('Error creating service:', error)
      setError('Failed to create service')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Game search functionality
  const searchGames = async (query: string) => {
    if (!query.trim()) {
      setGameSearchResults([])
      return
    }

    setGameSearchLoading(true)
    try {
      const response = await fetch(`/api/igdb/search-games?q=${encodeURIComponent(query)}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setGameSearchResults(data.games || [])
      }
    } catch (error) {
      console.error('Error searching games:', error)
    } finally {
      setGameSearchLoading(false)
    }
  }

  const selectGame = (game: any) => {
    // Store the game's platforms for manual selection
    setGamePlatforms(game.platforms || [])
    
    // Don't automatically select a platform - let user choose
    setFormData(prev => ({
      ...prev,
      gameId: game.id.toString(),
      gameName: game.name,
      platformId: '',
      platformName: ''
    }))
    setGameSearch('')
    setGameSearchResults([])
    setShowGameSearch(false)
  }

  const removeGame = () => {
    setFormData(prev => ({
      ...prev,
      gameId: '',
      gameName: '',
      platformId: '',
      platformName: ''
    }))
    setGamePlatforms([])
  }



  const selectGamePlatform = (platform: any) => {
    setFormData(prev => ({
      ...prev,
      platformId: platform.id.toString(),
      platformName: platform.name
    }))
    setShowGamePlatformSelect(false)
  }

  const removePlatform = () => {
    setFormData(prev => ({
      ...prev,
      platformId: '',
      platformName: ''
    }))
  }



  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Please sign in to create services.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <section className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
              <Link href="/profile/services/dashboard">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Create New Service
            </h1>
            <p className="text-xl text-gray-300">
              Offer your gaming expertise to the community
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="gaming-card border-0 bg-gradient-to-br from-green-600/10 to-green-800/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Service Details</CardTitle>
                <CardDescription className="text-gray-300">
                  Fill in the details of your gaming service
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Service Created!</h3>
                    <p className="text-gray-400">Redirecting to dashboard...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                          <span className="text-red-300">{error}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Service Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., CS2 Coaching Session"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                                         <div className="space-y-2">
                       <Label htmlFor="description" className="text-white">Description *</Label>
                       <Textarea
                         id="description"
                         name="description"
                         value={formData.description}
                         onChange={handleInputChange}
                         placeholder="Describe your service, what you offer, and your expertise..."
                         className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[120px]"
                         required
                       />
                     </div>

                     {/* Game Selection */}
                     <div className="space-y-2">
                       <Label className="text-white">Game (Optional)</Label>
                       {formData.gameName ? (
                         <div className="flex items-center gap-2 p-3 bg-white/10 border border-white/20 rounded-lg">
                           <Gamepad2 className="h-5 w-5 text-green-400" />
                           <span className="text-white flex-1">{formData.gameName}</span>
                           <Button
                             type="button"
                             variant="ghost"
                             size="sm"
                             onClick={removeGame}
                             className="text-gray-400 hover:text-red-400"
                           >
                             <X className="h-4 w-4" />
                           </Button>
                         </div>
                       ) : (
                         <div className="relative">
                           <div className="flex items-center gap-2">
                             <Input
                               type="text"
                               placeholder="Search for a game..."
                               value={gameSearch}
                               onChange={(e) => {
                                 setGameSearch(e.target.value)
                                 if (e.target.value.length >= 2) {
                                   searchGames(e.target.value)
                                   setShowGameSearch(true)
                                 } else {
                                   setShowGameSearch(false)
                                 }
                               }}
                               className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                             />
                             <Button
                               type="button"
                               variant="outline"
                               size="sm"
                               onClick={() => setShowGameSearch(!showGameSearch)}
                               className="border-white/20 text-white hover:bg-white/10"
                             >
                               <Search className="h-4 w-4" />
                             </Button>
                           </div>
                           
                           {showGameSearch && (
                             <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                               {gameSearchLoading ? (
                                 <div className="p-4 text-center">
                                   <Loader2 className="h-5 w-5 animate-spin text-green-400 mx-auto" />
                                   <p className="text-gray-400 text-sm mt-2">Searching games...</p>
                                 </div>
                               ) : gameSearchResults.length > 0 ? (
                                 <div className="py-2">
                                   {gameSearchResults.map((game) => (
                                     <button
                                       key={game.id}
                                       type="button"
                                       onClick={() => selectGame(game)}
                                       className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-3"
                                     >
                                       {game.cover?.url ? (
                                         <img
                                           src={game.cover.url.replace('t_thumb', 't_cover_small')}
                                           alt={game.name}
                                           className="w-8 h-8 rounded object-cover"
                                         />
                                       ) : (
                                         <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                                           <Gamepad2 className="h-4 w-4 text-gray-400" />
                                         </div>
                                       )}
                                                                               <div className="flex-1">
                                          <p className="text-white font-medium">{game.name}</p>
                                          {game.platforms && game.platforms.length > 0 && (
                                            <p className="text-gray-400 text-xs">
                                              {game.platforms.length} platform(s): {game.platforms.slice(0, 3).map((p: any) => p.name).join(', ')}
                                              {game.platforms.length > 3 && ` +${game.platforms.length - 3} more`}
                                            </p>
                                          )}
                                        </div>
                                     </button>
                                   ))}
                                 </div>
                               ) : gameSearch && !gameSearchLoading ? (
                                 <div className="p-4 text-center text-gray-400">
                                   No games found
                                 </div>
                               ) : null}
                             </div>
                           )}
                         </div>
                       )}
                     </div>

                                           {/* Platform Selection */}
                      <div className="space-y-2">
                        <Label className="text-white">Platform (Optional)</Label>
                        {formData.gameName && !formData.platformName && gamePlatforms.length > 0 && (
                          <div className="text-sm text-yellow-300 bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3">
                            💡 Tip: {formData.gameName} is available on {gamePlatforms.length} platform(s). Consider selecting one for better visibility.
                          </div>
                        )}
                        {formData.platformName ? (
                          <div className="flex items-center gap-2 p-3 bg-white/10 border border-white/20 rounded-lg">
                            <Monitor className="h-5 w-5 text-blue-400" />
                            <span className="text-white flex-1">{formData.platformName}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removePlatform}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="relative">
                                                         {gamePlatforms.length > 0 ? (
                               <div className="space-y-2">
                                 <div className="text-sm text-gray-300 mb-2">
                                   Select a platform for {formData.gameName}:
                                 </div>
                                 <Button
                                   type="button"
                                   variant="outline"
                                   onClick={() => setShowGamePlatformSelect(!showGamePlatformSelect)}
                                   className="w-full border-white/20 text-white hover:bg-white/10 justify-start"
                                 >
                                   <Gamepad2 className="h-4 w-4 mr-2" />
                                   Select platform ({gamePlatforms.length} available)
                                 </Button>
                               </div>
                             ) : (
                               <div className="text-sm text-gray-400">
                                 No platforms available for this game
                               </div>
                             )}
                            
                            

                            {showGamePlatformSelect && gamePlatforms.length > 0 && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                <div className="py-2">
                                  <div className="px-4 py-2 text-xs text-gray-400 border-b border-white/10">
                                    Available for {formData.gameName}
                                  </div>
                                  {gamePlatforms.map((platform) => (
                                    <button
                                      key={platform.id}
                                      type="button"
                                      onClick={() => selectGamePlatform(platform)}
                                      className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-3"
                                    >
                                      <Gamepad2 className="h-4 w-4 text-green-400" />
                                      <span className="text-white">{platform.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-white">Price (USD) *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="1"
                          step="0.01"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="25.00"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-white">Duration (minutes) *</Label>
                        <Input
                          id="duration"
                          name="duration"
                          type="number"
                          min="15"
                          step="15"
                          value={formData.duration}
                          onChange={handleInputChange}
                          placeholder="60"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="gaming-button flex-1"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Create Service
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        asChild
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                      >
                        <Link href="/profile/services/dashboard">
                          Cancel
                        </Link>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
} 