"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Gamepad2, 
  Languages, 
  Tags, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Star
} from "lucide-react"

interface Game {
  id: string
  name: string
  slug: string
  genre?: string | null
  platform?: string | null
  platforms?: Array<{id: number, name: string}> | null
  igdbCoverUrl?: string | null
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
}

const GAMING_CATEGORIES: Category[] = [
  {
    id: "competitive",
    name: "Competitive Gaming",
    description: "Esports, tournaments, ranked play",
    icon: "🏆"
  },
  {
    id: "casual",
    name: "Casual Gaming",
    description: "Relaxed, fun, social gaming",
    icon: "😊"
  },
  {
    id: "streaming",
    name: "Content Creation",
    description: "Streaming, YouTube, social media",
    icon: "📺"
  },
  {
    id: "coaching",
    name: "Coaching & Teaching",
    description: "Help others improve their skills",
    icon: "🎓"
  },
  {
    id: "events",
    name: "Event Organization",
    description: "Tournaments, meetups, LAN parties",
    icon: "🎪"
  },
  {
    id: "development",
    name: "Game Development",
    description: "Creating games, modding, tools",
    icon: "🛠️"
  }
]

const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner", color: "bg-green-600/20 text-green-300 border-green-500/30" },
  { value: "intermediate", label: "Intermediate", color: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30" },
  { value: "advanced", label: "Advanced", color: "bg-orange-600/20 text-orange-300 border-orange-500/30" },
  { value: "expert", label: "Expert", color: "bg-red-600/20 text-red-300 border-red-500/30" }
]

const LANGUAGE_LEVELS = [
  { value: "basic", label: "Basic" },
  { value: "conversational", label: "Conversational" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" }
]

const COMMON_LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", 
  "Russian", "Chinese", "Japanese", "Korean", "Arabic", "Hindi"
]

const COMMON_TAGS = [
  "Gamer", "Streamer", "Competitive", "Casual", "FPS", "RPG", 
  "Strategy", "MOBA", "Racing", "Fighting", "Puzzle", "Indie"
]

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form data
  const [bio, setBio] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedGames, setSelectedGames] = useState<{gameId: string, level: string, name?: string, platform?: string}[]>([])
  const [languages, setLanguages] = useState<{language: string, level: string}[]>([])
  const [tags, setTags] = useState<string[]>([])
  
  // Search states
  const [gameSearchQuery, setGameSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Game[]>([])
  const [searchingGames, setSearchingGames] = useState(false)
  const [allGames, setAllGames] = useState<Game[]>([]) // Store all games for reference

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    // Check if user has already completed onboarding
    if (session?.user) {
      console.log('Session found:', session);
      checkOnboardingStatus()
    } else {
      console.log('No session found');
    }
  }, [session])

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/user/onboarding-status')
      if (response.ok) {
        const data = await response.json()
        if (data.completed) {
          router.push('/profile')
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleGameSearch = async (query: string) => {
    setGameSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setSearchingGames(true)
    try {
      const response = await fetch(`/api/igdb/games?q=${encodeURIComponent(query)}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        // Transform the games to include the id as string
        const transformedGames = (data.games || []).map((game: any) => ({
          ...game,
          id: game.id.toString() // Ensure id is string
        }))
        setSearchResults(transformedGames)
        // Also store in allGames for reference
        setAllGames(prev => {
          const newGames = [...prev]
          transformedGames.forEach(game => {
            if (!newGames.find(g => g.id === game.id)) {
              newGames.push(game)
            }
          })
          return newGames
        })
      }
    } catch (error) {
      console.error('Error searching games:', error)
    } finally {
      setSearchingGames(false)
    }
  }

  const handleAddGame = (game: Game, level: string, platform?: string) => {
    const existingGame = selectedGames.find(g => g.gameId === game.id)
    if (existingGame) {
      setSelectedGames(prev => prev.map(g => 
        g.gameId === game.id ? { 
          ...g, 
          level, 
          platform: platform || existingGame.platform || game.platform 
        } : g
      ))
    } else {
      setSelectedGames(prev => [...prev, { 
        gameId: game.id, 
        level,
        name: game.name, // Include the game name
        platform: platform || game.platform // Include the platform
      }])
    }
    setGameSearchQuery("")
    setSearchResults([])
  }

  const handleRemoveGame = (gameId: string) => {
    setSelectedGames(prev => prev.filter(g => g.gameId !== gameId))
  }

  const handleAddLanguage = () => {
    setLanguages(prev => [...prev, { language: "", level: "conversational" }])
  }

  const handleUpdateLanguage = (index: number, field: 'language' | 'level', value: string) => {
    setLanguages(prev => prev.map((lang, i) => 
      i === index ? { ...lang, [field]: value } : lang
    ))
  }

  const handleRemoveLanguage = (index: number) => {
    setLanguages(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag])
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // First test the session
      console.log('Testing session before submit...');
      const sessionTest = await fetch('/api/test-session');
      const sessionData = await sessionTest.json();
      console.log('Session test result:', sessionData);
      
      // Use debug endpoint for detailed testing
      const response = await fetch('/api/debug-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio,
          categories: selectedCategories,
          games: selectedGames,
          languages,
          tags
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Onboarding completed successfully:', result)
        router.push('/profile')
      } else {
        const errorData = await response.json()
        console.error('Failed to save onboarding data:', errorData)
        
        // Show more detailed error message
        const errorMessage = errorData.details || errorData.error || 'Unknown error'
        const step = errorData.step ? ` (Step: ${errorData.step})` : ''
        alert(`Failed to save onboarding data: ${errorMessage}${step}`)
        
        // Log the full response for debugging
        console.log('Full response:', response)
        console.log('Response status:', response.status)
        console.log('Response headers:', response.headers)
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error)
      alert('Failed to save onboarding data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to GamingWithYou! 🎮
          </h1>
          <p className="text-xl text-gray-300">
            Let's set up your gaming profile
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-400'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{step}</span>
                  )}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-green-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-gray-400">
            Step {currentStep} of 4
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Tell us about yourself
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Help other gamers get to know you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Bio</label>
                  <Textarea
                    placeholder="Tell us about your gaming journey, favorite genres, or what you're looking for..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Gaming Categories</label>
                  <p className="text-gray-400 mb-4">Select the categories that best describe your gaming activities</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GAMING_CATEGORIES.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCategories.includes(category.id)
                            ? 'border-green-500 bg-green-600/20'
                            : 'border-white/20 bg-white/5 hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h3 className="text-white font-medium">{category.name}</h3>
                            <p className="text-gray-400 text-sm">{category.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gamepad2 className="h-6 w-6" />
                  Your Favorite Games
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Add games you play and your skill level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Game Search */}
                <div>
                  <label className="block text-white font-medium mb-2">Search Games</label>
                  <div className="relative">
                    <Input
                      placeholder="Search for games..."
                      value={gameSearchQuery}
                      onChange={(e) => handleGameSearch(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    {searchingGames && (
                      <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-green-400" />
                    )}
                  </div>
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {searchResults.map((game) => (
                        <div key={game.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                              {game.igdbCoverUrl ? (
                                <img 
                                  src={game.igdbCoverUrl} 
                                  alt={game.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Gamepad2 className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{game.name}</h3>
                              <p className="text-gray-400 text-sm">
                                {game.genre} • {game.platform}
                                {game.platforms && game.platforms.length > 1 && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    (+{game.platforms.length - 1} more)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                                                     <div className="flex gap-2">
                                                           <select
                                className="bg-white/10 border-white/20 text-white rounded-md px-3 py-2 text-sm"
                                value={selectedGames.find(g => g.gameId === game.id)?.platform || ''}
                                onChange={(e) => {
                                  const platform = e.target.value
                                  if (platform) {
                                    const existingGame = selectedGames.find(g => g.gameId === game.id)
                                    if (existingGame) {
                                      setSelectedGames(prev => prev.map(g => 
                                        g.gameId === game.id ? { ...g, platform } : g
                                      ))
                                    } else {
                                      setSelectedGames(prev => [...prev, { 
                                        gameId: game.id, 
                                        level: 'beginner',
                                        name: game.name,
                                        platform
                                      }])
                                    }
                                  }
                                }}
                              >
                               <option value="">Select Platform</option>
                               {game.platforms && game.platforms.length > 0 ? (
                                 game.platforms.map((platform) => (
                                   <option key={platform.id} value={platform.name}>
                                     {platform.name}
                                   </option>
                                 ))
                               ) : (
                                 <>
                                   <option value="PC">PC</option>
                                   <option value="PlayStation">PlayStation</option>
                                   <option value="Xbox">Xbox</option>
                                   <option value="Nintendo">Nintendo</option>
                                   <option value="Mobile">Mobile</option>
                                   <option value="VR">VR</option>
                                   <option value="Other">Other</option>
                                 </>
                               )}
                             </select>
                             {SKILL_LEVELS.map((level) => (
                               <Button
                                 key={level.value}
                                 size="sm"
                                 variant="outline"
                                 className={`border-white/20 text-white hover:bg-white/10 ${
                                   selectedGames.find(g => g.gameId === game.id)?.level === level.value
                                     ? 'bg-green-600 border-green-500'
                                     : ''
                                 }`}
                                                                   onClick={() => {
                                    const existingGame = selectedGames.find(g => g.gameId === game.id)
                                    const currentPlatform = existingGame?.platform || game.platform || 'PC'
                                    handleAddGame(game, level.value, currentPlatform)
                                  }}
                               >
                                 {level.label}
                               </Button>
                             ))}
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                                 {/* Selected Games */}
                 {selectedGames.length > 0 && (
                   <div>
                     <label className="block text-white font-medium mb-2">Your Games</label>
                     <div className="space-y-2">
                                               {selectedGames.map((userGame) => {
                          const game = allGames.find(g => g.id === userGame.gameId) || 
                                      searchResults.find(g => g.id === userGame.gameId) || 
                                      { name: userGame.name || `Game ${userGame.gameId}`, genre: "", platform: userGame.platform || "" }
                          const level = SKILL_LEVELS.find(l => l.value === userGame.level)
                          
                          return (
                            <div key={userGame.gameId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Gamepad2 className="h-6 w-6 text-green-400" />
                                <div>
                                  <h3 className="text-white font-medium">{game.name}</h3>
                                  <p className="text-gray-400 text-sm">
                                    {game.genre} • {game.platform}
                                    {game.platforms && game.platforms.length > 1 && (
                                      <span className="text-xs text-gray-500 ml-1">
                                        (+{game.platforms.length - 1} more)
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                                                           <div className="flex items-center gap-2">
                                                                 <select
                                   className="bg-white/10 border-white/20 text-white rounded-md px-2 py-1 text-xs"
                                   value={userGame.platform || ''}
                                   onChange={(e) => {
                                     const platform = e.target.value
                                     setSelectedGames(prev => prev.map(g => 
                                       g.gameId === userGame.gameId ? { ...g, platform } : g
                                     ))
                                   }}
                                 >
                                   <option value="">Platform</option>
                                   {game.platforms && game.platforms.length > 0 ? (
                                     game.platforms.map((platform) => (
                                       <option key={platform.id} value={platform.name}>
                                         {platform.name}
                                       </option>
                                     ))
                                   ) : (
                                     <>
                                       <option value="PC">PC</option>
                                       <option value="PlayStation">PlayStation</option>
                                       <option value="Xbox">Xbox</option>
                                       <option value="Nintendo">Nintendo</option>
                                       <option value="Mobile">Mobile</option>
                                       <option value="VR">VR</option>
                                       <option value="Other">Other</option>
                                     </>
                                   )}
                                 </select>
                                <Badge className={level?.color}>
                                  {level?.label}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                                  onClick={() => handleRemoveGame(userGame.gameId)}
                                >
                                  Remove
                                </Button>
                              </div>
                           </div>
                         )
                       })}
                     </div>
                   </div>
                 )}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Languages className="h-6 w-6" />
                  Languages & Skills
                </CardTitle>
                <CardDescription className="text-gray-300">
                  What languages do you speak and at what level?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Languages */}
                <div>
                  <label className="block text-white font-medium mb-2">Languages</label>
                  <div className="space-y-4">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <select
                          value={lang.language}
                          onChange={(e) => handleUpdateLanguage(index, 'language', e.target.value)}
                          className="bg-white/10 border-white/20 text-white rounded-md px-3 py-2 flex-1"
                        >
                          <option value="">Select language</option>
                          {COMMON_LANGUAGES.map(language => (
                            <option key={language} value={language}>
                              {language}
                            </option>
                          ))}
                        </select>
                        <select
                          value={lang.level}
                          onChange={(e) => handleUpdateLanguage(index, 'level', e.target.value)}
                          className="bg-white/10 border-white/20 text-white rounded-md px-3 py-2"
                        >
                          {LANGUAGE_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                          onClick={() => handleRemoveLanguage(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={handleAddLanguage}
                    >
                      + Add Language
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-white font-medium mb-2">Tags</label>
                  <p className="text-gray-400 mb-4">Add tags that describe your gaming style or interests</p>
                  
                  {/* Common Tags */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Common Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_TAGS.map(tag => (
                        <Button
                          key={tag}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTag(tag)}
                          disabled={tags.includes(tag)}
                          className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Tags */}
                  {tags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2">Your Tags:</h4>
                      <div className="flex gap-2 flex-wrap">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-green-600/20 text-green-300 border-green-500/30 cursor-pointer hover:bg-red-600/20 hover:text-red-300 hover:border-red-500/30"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Tag Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a custom tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTag(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a custom tag..."]') as HTMLInputElement
                        if (input?.value) {
                          handleAddTag(input.value)
                          input.value = ''
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Review Your Profile
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Review your information before completing setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bio */}
                {bio && (
                  <div>
                    <h3 className="text-white font-medium mb-2">Bio</h3>
                    <p className="text-gray-300 bg-white/5 p-3 rounded-lg">{bio}</p>
                  </div>
                )}

                {/* Categories */}
                {selectedCategories.length > 0 && (
                  <div>
                    <h3 className="text-white font-medium mb-2">Categories</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedCategories.map((categoryId) => {
                        const category = GAMING_CATEGORIES.find(c => c.id === categoryId)
                        return (
                          <Badge key={categoryId} className="bg-green-600/20 text-green-300 border-green-500/30">
                            {category?.icon} {category?.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}

                                 {/* Games */}
                 {selectedGames.length > 0 && (
                   <div>
                     <h3 className="text-white font-medium mb-2">Games</h3>
                     <div className="space-y-2">
                                               {selectedGames.map((userGame) => {
                          const game = allGames.find(g => g.id === userGame.gameId) || 
                                      searchResults.find(g => g.id === userGame.gameId) || 
                                      { name: userGame.name || `Game ${userGame.gameId}`, platform: userGame.platform || "" }
                          const level = SKILL_LEVELS.find(l => l.value === userGame.level)
                          
                                                     return (
                             <div key={userGame.gameId} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                               <div>
                                 <span className="text-white">{game.name}</span>
                                 {userGame.platform && (
                                   <span className="text-gray-400 text-sm ml-2">• {userGame.platform}</span>
                                 )}
                               </div>
                               <Badge className={level?.color}>
                                 {level?.label}
                               </Badge>
                             </div>
                           )
                        })}
                     </div>
                   </div>
                 )}

                {/* Languages */}
                {languages.length > 0 && (
                  <div>
                    <h3 className="text-white font-medium mb-2">Languages</h3>
                    <div className="space-y-2">
                      {languages.map((lang, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-white">{lang.language}</span>
                          <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                            {lang.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div>
                    <h3 className="text-white font-medium mb-2">Tags</h3>
                    <div className="flex gap-2 flex-wrap">
                      {tags.map((tag) => (
                        <Badge key={tag} className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              className="gaming-button"
              onClick={() => {
                if (currentStep === 4) {
                  handleSubmit()
                } else {
                  setCurrentStep(prev => Math.min(4, prev + 1))
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : currentStep === 4 ? (
                <>
                  Complete Setup
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 