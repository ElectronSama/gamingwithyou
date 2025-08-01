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
  Save,
  ArrowLeft,
  Loader2,
  Plus,
  X,
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

interface UserProfile {
  id: string
  username: string
  email: string
  bio?: string | null
  isAdmin: boolean
  createdAt: string
  userGames: Array<{
    id: string
    level: string
    platform?: string | null
    game: {
      id: string
      name: string
      genre?: string | null
      platform?: string | null
    }
  }>
  userLanguages: Array<{
    id: string
    language: string
    level: string
  }>
  userTags: Array<{
    id: string
    tag: string
  }>
}

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

const GAMING_CATEGORIES = [
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

const COMMON_TAGS = [
  "Gamer", "Streamer", "Competitive", "Casual", "FPS", "RPG", 
  "Strategy", "MOBA", "Racing", "Fighting", "Puzzle", "Indie"
]

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form data
  const [bio, setBio] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedGames, setSelectedGames] = useState<{gameId: string, level: string, name?: string, platform?: string}[]>([])
  const [languages, setLanguages] = useState<{language: string, level: string}[]>([])
  const [tags, setTags] = useState<string[]>([])
  
  // Game search states
  const [gameSearchQuery, setGameSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Game[]>([])
  const [searchingGames, setSearchingGames] = useState(false)
  const [allGames, setAllGames] = useState<Game[]>([])
  const [loadingPlatforms, setLoadingPlatforms] = useState<Set<string>>(new Set())
  const [savingPlatforms, setSavingPlatforms] = useState<Set<string>>(new Set())
  
  // Game selection modal states
  const [selectedGameForSetup, setSelectedGameForSetup] = useState<Game | null>(null)
  const [showGameSetupModal, setShowGameSetupModal] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<{[platform: string]: string}>({})
  
  // Edit game modal states
  const [editingGame, setEditingGame] = useState<{gameId: string, level: string, name?: string, platform?: string} | null>(null)
  const [showEditGameModal, setShowEditGameModal] = useState(false)
  const [editPlatforms, setEditPlatforms] = useState<string[]>([])
  const [editSkillLevels, setEditSkillLevels] = useState<{[platform: string]: string}>({})

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  // Fetch platform data for games that don't have it
  useEffect(() => {
    selectedGames.forEach((userGame) => {
      const game = allGames.find(g => g.id === userGame.gameId)
      if (game && (!game.platforms || game.platforms.length === 0)) {
        fetchGamePlatforms(userGame.gameId)
      }
    })
  }, [selectedGames, allGames])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        const profileData = data.profile
        setProfile(profileData)
        
        // Initialize form data with current profile
        setBio(profileData.bio || "")
        console.log('Profile data userGames:', profileData.userGames);
        setSelectedGames(profileData.userGames.map((ug: any) => ({
          gameId: ug.game.id,
          level: ug.level,
          name: ug.game.name,
          platform: ug.platform
        })))
        setLanguages(profileData.userLanguages.map((ul: any) => ({
          language: ul.language,
          level: ul.level
        })))
        
        // Filter out category tags and only show regular tags
        const regularTags = profileData.userTags
          .filter((ut: any) => !ut.tag.startsWith('category:'))
          .map((ut: any) => ut.tag)
        setTags(regularTags)
        
        // Extract categories from tags (tags that start with "category:")
        const categoryTags = profileData.userTags
          .filter((ut: any) => ut.tag.startsWith('category:'))
          .map((ut: any) => ut.tag.replace('category:', ''))
        setSelectedCategories(categoryTags)

        // Add games to allGames with basic data
        const basicGames = profileData.userGames.map((ug: any) => ({
          id: ug.game.id.toString(),
          name: ug.game.name,
          slug: ug.game.slug || ug.game.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          genre: ug.game.genre,
          platform: ug.game.platform,
          igdbCoverUrl: ug.game.igdbCoverUrl
        }))
        setAllGames(basicGames)

        // Fetch platform data for each game
        setTimeout(() => {
          basicGames.forEach(async (game: any) => {
            if (game.slug) {
              await fetchGamePlatforms(game.id.toString())
            }
          })
        }, 100)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
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
        const transformedGames = (data.games || []).map((game: any) => ({
          ...game,
          id: game.id.toString()
        }))
        setSearchResults(transformedGames)
        
        // Store in allGames for reference
        setAllGames(prev => {
          const newGames = [...prev]
          transformedGames.forEach((game: any) => {
            const existingGame = newGames.find(g => g.id === game.id)
            if (!existingGame) {
              newGames.push(game)
            } else {
              const index = newGames.findIndex(g => g.id === game.id)
              newGames[index] = { ...existingGame, ...game }
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
    const selectedPlatform = platform || game.platform || undefined
    const existingGame = selectedGames.find(g => 
      g.gameId === game.id && 
      g.platform === selectedPlatform && 
      g.level === level
    )
    
    if (existingGame) {
      // If the exact same game/platform/level combination already exists, don't add it again
      return
    } else {
      setSelectedGames(prev => [...prev, { 
        gameId: game.id, 
        level,
        name: game.name,
        platform: selectedPlatform
      }])
    }
    
    // Store game in allGames
    setAllGames(prev => {
      const existingGameInAll = prev.find(g => g.id === game.id)
      if (!existingGameInAll) {
        return [...prev, game]
      } else {
        return prev.map(g => g.id === game.id ? { ...g, ...game } : g)
      }
    })
    
    setGameSearchQuery("")
    setSearchResults([])
  }

  const handleRemoveGame = (gameId: string, platform?: string, level?: string) => {
    // Remove specific game/platform/level combination or all entries for the game
    if (platform && level) {
      setSelectedGames(prev => prev.filter(g => 
        !(g.gameId === gameId && g.platform === platform && g.level === level)
      ))
    } else {
      setSelectedGames(prev => prev.filter(g => g.gameId !== gameId))
    }
  }

  const fetchGamePlatforms = async (gameId: string) => {
    if (loadingPlatforms.has(gameId)) return
    
    setLoadingPlatforms(prev => new Set(prev).add(gameId))
    try {
      const game = allGames.find(g => g.id === gameId)
      
      if (!game) {
        console.warn('Game not found for ID:', gameId)
        return
      }
      
      let slug = game.slug
      if (!slug && game.name) {
        slug = game.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
      
      if (!slug) {
        console.warn('No slug available for game ID:', gameId)
        return
      }
      
      let response = await fetch(`/api/igdb/game/${slug}`)
      if (!response.ok) {
        console.warn(`Slug-based search failed for ${slug}, trying name-based search`)
        const searchResponse = await fetch(`/api/igdb/games?q=${encodeURIComponent(game.name)}&limit=1`)
        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          if (searchData.games && searchData.games.length > 0) {
            const foundGame = searchData.games[0]
            if (foundGame.platforms) {
              setAllGames(prev => prev.map(g => 
                g.id === gameId ? { ...g, platforms: foundGame.platforms } : g
              ))
              return
            }
          }
        }
      } else {
        const data = await response.json()
        if (data.game && data.game.platforms) {
          setAllGames(prev => prev.map(g => 
            g.id === gameId ? { ...g, platforms: data.game.platforms } : g
          ))
        }
      }
    } catch (error) {
      console.error('Error fetching game platforms:', error)
    } finally {
      setLoadingPlatforms(prev => {
        const newSet = new Set(prev)
        newSet.delete(gameId)
        return newSet
      })
    }
  }

  const handlePlatformChange = async (gameId: string, platform: string) => {
    const updatedGames = selectedGames.map(g => 
      g.gameId === gameId ? { ...g, platform } : g
    )
    setSelectedGames(updatedGames)
    
    // Auto-save the platform change
    setSavingPlatforms(prev => new Set(prev).add(gameId))
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio,
          categories: selectedCategories,
          games: updatedGames,
          languages,
          tags
        }),
      })
      
      if (!response.ok) {
        console.error('Failed to auto-save platform change')
      }
    } catch (error) {
      console.error('Error auto-saving platform change:', error)
    } finally {
      setSavingPlatforms(prev => {
        const newSet = new Set(prev)
        newSet.delete(gameId)
        return newSet
      })
    }
  }

  const handleSkillLevelChange = async (gameId: string, level: string) => {
    const updatedGames = selectedGames.map(g => 
      g.gameId === gameId ? { ...g, level } : g
    )
    setSelectedGames(updatedGames)
    
    // Auto-save the skill level change
    setSavingPlatforms(prev => new Set(prev).add(gameId))
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio,
          categories: selectedCategories,
          games: updatedGames,
          languages,
          tags
        }),
      })
      
      if (!response.ok) {
        console.error('Failed to auto-save skill level change')
      }
    } catch (error) {
      console.error('Error auto-saving skill level change:', error)
    } finally {
      setSavingPlatforms(prev => {
        const newSet = new Set(prev)
        newSet.delete(gameId)
        return newSet
      })
    }
  }

  const handleGameSelect = (game: Game) => {
    console.log('handleGameSelect called with game:', game)
    setSelectedGameForSetup(game)
    setSelectedPlatforms([])
    setSelectedSkillLevels({})
    setShowGameSetupModal(true)
    console.log('Modal should be visible now')
  }

  const handleQuickAdd = (game: Game) => {
    // Quick add with default platform and beginner level
    const defaultPlatform = game.platform || 'PC'
    handleAddGame(game, 'beginner', defaultPlatform)
  }

  const handleSkillLevelClick = (game: Game, level: string, existingGame?: any) => {
    const gamePlatform = game.platform || 'PC'
    if (existingGame) {
      handleSkillLevelChange(game.id, level)
    } else {
      const platform = existingGame?.platform || gamePlatform
      handleAddGame(game, level, platform)
    }
  }

  const handleAddLanguage = () => {
    setLanguages([...languages, { language: "", level: "conversational" }])
  }

  const handleUpdateLanguage = (index: number, field: 'language' | 'level', value: string) => {
    const updatedLanguages = [...languages]
    updatedLanguages[index][field] = value
    setLanguages(updatedLanguages)
  }

  const handleRemoveLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index))
  }

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

             const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform] // Allow multiple platforms
    )
    
    // When adding a platform, set default skill level
    if (!selectedPlatforms.includes(platform)) {
      setSelectedSkillLevels(prev => ({
        ...prev,
        [platform]: "beginner"
      }))
    }
  }

  const handleModalSkillLevelChange = (platform: string, level: string) => {
    setSelectedSkillLevels(prev => ({
      ...prev,
      [platform]: level
    }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleEditGame = (userGame: {gameId: string, level: string, name?: string, platform?: string}) => {
    setEditingGame(userGame)
    
    // Find all games with the same gameId to get all platforms
    const allGamesForThisGame = selectedGames.filter(g => g.gameId === userGame.gameId)
    const allPlatforms = allGamesForThisGame.map(g => g.platform).filter(Boolean) as string[]
    const allLevels = allGamesForThisGame.map(g => g.level)
    
    setEditPlatforms(allPlatforms)
    
    // Create skill levels object for all platforms
    const skillLevelsObj: {[platform: string]: string} = {}
    allGamesForThisGame.forEach(game => {
      if (game.platform) {
        skillLevelsObj[game.platform] = game.level
      }
    })
    setEditSkillLevels(skillLevelsObj)
    
    setShowEditGameModal(true)
  }

  const handleEditPlatformToggle = (platform: string) => {
    setEditPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform] // Allow multiple platforms
    )
    
    // When adding a platform, set default skill level
    if (!editPlatforms.includes(platform)) {
      setEditSkillLevels(prev => ({
        ...prev,
        [platform]: editingGame?.level || "beginner"
      }))
    }
  }

  const handleEditSkillLevelChange = (platform: string, level: string) => {
    setEditSkillLevels(prev => ({
      ...prev,
      [platform]: level
    }))
  }

  const handleSaveGameEdit = () => {
    if (!editingGame || editPlatforms.length === 0) {
      alert('Please select at least one platform')
      return
    }

    // Remove all existing entries for this game
    const gamesWithoutThisGame = selectedGames.filter(g => g.gameId !== editingGame.gameId)
    
    // Add new entries for each selected platform
    const newGameEntries = editPlatforms.map(platform => ({
      gameId: editingGame.gameId,
      level: editSkillLevels[platform] || editingGame.level,
      name: editingGame.name,
      platform: platform
    }))
    
    // Combine the games
    const updatedGames = [...gamesWithoutThisGame, ...newGameEntries]
    setSelectedGames(updatedGames)

    // Auto-save the changes for each platform
    editPlatforms.forEach(platform => {
      const skillLevel = editSkillLevels[platform] || editingGame.level
      // Note: We'll need to handle this differently since we're updating multiple entries
      // For now, we'll just update the state and let the main save handle it
    })

    // Close modal and reset
    setShowEditGameModal(false)
    setEditingGame(null)
    setEditPlatforms([])
    setEditSkillLevels({})
  }

             const handleAddGameFromModal = () => {
    if (!selectedGameForSetup || selectedPlatforms.length === 0) {
      alert('Please select at least one platform')
      return
    }

    // Add the game for each selected platform with its skill level
    selectedPlatforms.forEach(platform => {
      const skillLevel = selectedSkillLevels[platform] || "beginner"
      handleAddGame(selectedGameForSetup, skillLevel, platform)
    })

    // Close modal and reset
    setShowGameSetupModal(false)
    setSelectedGameForSetup(null)
    setSelectedPlatforms([])
    setSelectedSkillLevels({})
    setGameSearchQuery("")
    setSearchResults([])
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
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
        router.push('/profile')
      } else {
        const errorData = await response.json()
        alert(`Failed to save profile: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white text-xl">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
                              {/* Game Setup Modal */}
        {showGameSetupModal && selectedGameForSetup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            {(() => { console.log('Modal is rendering, showGameSetupModal:', showGameSetupModal, 'selectedGameForSetup:', selectedGameForSetup); return null; })()}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
                           <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Add {selectedGameForSetup.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowGameSetupModal(false)
                    setSelectedPlatforms([])
                    setSelectedSkillLevels({})
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
             
                                                     {/* Platform Selection with Skill Levels */}
               <div className="mb-6">
                 <label className="block text-white font-medium mb-3">Select Platforms & Skill Levels</label>
                 <div className="space-y-3">
                   {(selectedGameForSetup.platforms && selectedGameForSetup.platforms.length > 0 ? 
                     // Remove duplicates by platform name
                     Array.from(new Set(selectedGameForSetup.platforms.map(p => p.name))).map((platformName) => {
                       return platformName
                     }) : 
                     ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile", "VR", "Other"]
                   ).map((platform) => (
                     <div key={`platform-${platform}`} className="flex items-center p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                       <Button
                         variant="outline"
                         size="sm"
                         className={`border-white/20 text-white hover:bg-white/10 text-sm py-2 backdrop-blur-sm ${
                           selectedPlatforms.includes(platform)
                             ? 'bg-green-600/80 border-green-500 backdrop-blur-md'
                             : 'bg-white/10'
                         }`}
                         onClick={() => handlePlatformToggle(platform)}
                       >
                         {platform}
                       </Button>
                       {selectedPlatforms.includes(platform) && (
                         <div className="flex items-center gap-4 ml-4 flex-1">
                           <span className="text-white text-sm mr-2">Skill:</span>
                           <div className="flex gap-3">
                             {[1, 2, 3, 4].map((level) => {
                               const skillValue = level === 1 ? 'beginner' : 
                                                 level === 2 ? 'intermediate' : 
                                                 level === 3 ? 'advanced' : 'expert'
                               const isSelected = selectedSkillLevels[platform] === skillValue
                               
                               return (
                                 <button
                                   key={`skill-${platform}-${level}`}
                                   onClick={() => handleModalSkillLevelChange(platform, skillValue)}
                                   className={`w-4 h-4 rounded-full transition-all backdrop-blur-sm ${
                                     isSelected 
                                       ? 'bg-green-500 scale-125 shadow-lg' 
                                       : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                                   }`}
                                   title={skillValue}
                                 />
                               )
                             })}
                           </div>
                           <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold 
                             ${
                               selectedSkillLevels[platform] === 'beginner' ? 'bg-green-600/30 text-green-200 border border-green-400/40' :
                               selectedSkillLevels[platform] === 'intermediate' ? 'bg-yellow-600/30 text-yellow-200 border border-yellow-400/40' :
                               selectedSkillLevels[platform] === 'advanced' ? 'bg-orange-600/30 text-orange-200 border border-orange-400/40' :
                               selectedSkillLevels[platform] === 'expert' ? 'bg-red-600/30 text-red-200 border border-red-400/40' :
                               'bg-white/10 text-white border border-white/20'
                             }
                           `}>
                             {selectedSkillLevels[platform] === 'beginner' ? 'Beginner' :
                               selectedSkillLevels[platform] === 'intermediate' ? 'Intermediate' :
                               selectedSkillLevels[platform] === 'advanced' ? 'Advanced' :
                               selectedSkillLevels[platform] === 'expert' ? 'Expert' : 'Beginner'}
                           </span>
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
             
                          {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setShowGameSetupModal(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                                 <Button
                   onClick={handleAddGameFromModal}
                   className="flex-1 gaming-button"
                   disabled={selectedPlatforms.length === 0}
                 >
                   Add {selectedPlatforms.length > 0 ? `(${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''})` : ''}
                 </Button>
              </div>
           </div>
         </div>
       )}

               {/* Edit Game Modal */}
        {showEditGameModal && editingGame && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-white text-lg font-semibold">Edit {editingGame.name}</h3>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => setShowEditGameModal(false)}
                 className="text-gray-400 hover:text-white"
               >
                 <X className="h-4 w-4" />
               </Button>
             </div>
             
                           {/* Platform Selection with Skill Levels */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">Select Platforms & Skill Levels</label>
                <div className="space-y-3">
                  {(() => {
                    const game = allGames.find(g => g.id === editingGame.gameId)
                    const platforms = game?.platforms && game.platforms.length > 0 ? 
                      // Remove duplicates by platform name
                      Array.from(new Set(game.platforms.map(p => p.name))) : 
                      ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile", "VR", "Other"]
                    
                    return platforms.map((platform) => (
                      <div key={`edit-platform-${platform}`} className="flex items-center p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`border-white/20 text-white hover:bg-white/10 text-sm py-2 backdrop-blur-sm ${
                            editPlatforms.includes(platform)
                              ? 'bg-green-600/80 border-green-500 backdrop-blur-md'
                              : 'bg-white/10'
                          }`}
                          onClick={() => handleEditPlatformToggle(platform)}
                        >
                          {platform}
                        </Button>
                        {editPlatforms.includes(platform) && (
                          <div className="flex items-center gap-4 ml-4 flex-1">
                            <span className="text-white text-sm mr-2">Skill:</span>
                            <div className="flex gap-3">
                              {[1, 2, 3, 4].map((level) => {
                                const skillValue = level === 1 ? 'beginner' : 
                                                  level === 2 ? 'intermediate' : 
                                                  level === 3 ? 'advanced' : 'expert'
                                const isSelected = editSkillLevels[platform] === skillValue
                                
                                return (
                                  <button
                                    key={`edit-skill-${platform}-${level}`}
                                    onClick={() => handleEditSkillLevelChange(platform, skillValue)}
                                    className={`w-4 h-4 rounded-full transition-all backdrop-blur-sm ${
                                      isSelected 
                                        ? 'bg-green-500 scale-125 shadow-lg' 
                                        : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                                    }`}
                                    title={skillValue}
                                  />
                                )
                              })}
                            </div>
                            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold 
                              ${
                                editSkillLevels[platform] === 'beginner' ? 'bg-green-600/30 text-green-200 border border-green-400/40' :
                                editSkillLevels[platform] === 'intermediate' ? 'bg-yellow-600/30 text-yellow-200 border border-yellow-400/40' :
                                editSkillLevels[platform] === 'advanced' ? 'bg-orange-600/30 text-orange-200 border border-orange-400/40' :
                                editSkillLevels[platform] === 'expert' ? 'bg-red-600/30 text-red-200 border border-red-400/40' :
                                'bg-white/10 text-white border border-white/20'
                              }
                            `}>
                              {editSkillLevels[platform] === 'beginner' ? 'Beginner' :
                                editSkillLevels[platform] === 'intermediate' ? 'Intermediate' :
                                editSkillLevels[platform] === 'advanced' ? 'Advanced' :
                                editSkillLevels[platform] === 'expert' ? 'Expert' : 'Beginner'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  })()}
                </div>
              </div>
             
                           {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setShowEditGameModal(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveGameEdit}
                  className="flex-1 gaming-button"
                  disabled={editPlatforms.length === 0}
                >
                  Save Changes
                </Button>
              </div>
           </div>
         </div>
       )}

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => router.push('/profile')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <Button
              className="gaming-button"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Edit Profile
          </h1>
          <p className="text-xl text-gray-300">
            Update your gaming preferences and information
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
                     {/* Bio Section */}
           <Card className="gaming-card bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-6 w-6" />
                About You
              </CardTitle>
              <CardDescription className="text-gray-300">
                Tell other gamers about yourself
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Share your gaming story, interests, or what you're looking for..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                                 className="min-h-[120px] bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400"
              />
            </CardContent>
          </Card>

                     {/* Categories Section */}
           <Card className="gaming-card bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-6 w-6" />
                Gaming Categories
              </CardTitle>
              <CardDescription className="text-gray-300">
                Select the categories that best describe your gaming activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {GAMING_CATEGORIES.map((category, index) => (
                   <div
                     key={`${category.id}-${index}`}
                    onClick={() => handleCategoryToggle(category.id)}
                                         className={`p-4 rounded-xl border-2 cursor-pointer transition-all backdrop-blur-sm ${
                       selectedCategories.includes(category.id)
                         ? 'border-green-500 bg-green-600/20 backdrop-blur-md'
                         : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
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
            </CardContent>
          </Card>

                     {/* Games Section */}
           <Card className="gaming-card bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gamepad2 className="h-6 w-6" />
                Your Games
              </CardTitle>
              <CardDescription className="text-gray-300">
                Add the games you play and your skill level
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
                                         className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400"
                  />
                  {searchingGames && (
                    <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-green-400" />
                  )}
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {searchResults.map((game: Game, index) => {
                      const existingGame = selectedGames.find(g => g.gameId === game.id)
                      const isSelected = !!existingGame
                      
                      return (
                                                 <div key={`search-${game.id}-${index}`} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
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
                            {isSelected ? (
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                                  Added
                                </Badge>
                                <span className="text-xs text-gray-400">
                                  ({selectedGames.filter(g => g.gameId === game.id).length} entries)
                                </span>
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                                  onClick={() => handleGameSelect(game)}
                                >
                                  Add
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                                  onClick={() => handleQuickAdd(game)}
                                >
                                  Quick Add
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Selected Games */}
              {selectedGames.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white font-medium">Your Games</label>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                      onClick={() => setSelectedGames([])}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(() => {
                      // Group games by gameId to show only one entry per game
                      const groupedGames = selectedGames.reduce((acc, userGame) => {
                        const gameId = userGame.gameId
                        if (!acc[gameId]) {
                          acc[gameId] = {
                            gameId: userGame.gameId,
                            name: userGame.name,
                            // Get all platforms and levels for this game
                            platforms: selectedGames
                              .filter(g => g.gameId === gameId)
                              .map(g => ({ platform: g.platform, level: g.level }))
                              .filter(p => p.platform)
                          }
                        }
                        return acc
                      }, {} as Record<string, any>)

                      return Object.values(groupedGames).map((groupedGame: any, index) => {
                        const game = allGames.find(g => g.id === groupedGame.gameId) || 
                                    { id: groupedGame.gameId, slug: "", name: groupedGame.name || `Game ${groupedGame.gameId}`, genre: "", platform: "", platforms: [] } as Game
                        
                        return (
                          <div key={`${groupedGame.gameId}-${index}`} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                            <div className="flex items-center gap-3">
                              <Gamepad2 className="h-6 w-6 text-green-400" />
                              <div>
                                <h3 className="text-white font-medium">{game.name}</h3>
                                <p className="text-gray-400 text-sm">
                                  {game.genre} • {groupedGame.platforms.length} platform{groupedGame.platforms.length > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                                onClick={() => handleEditGame({ gameId: groupedGame.gameId, level: groupedGame.platforms[0]?.level || 'beginner', name: groupedGame.name, platform: groupedGame.platforms[0]?.platform })}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                                onClick={() => handleRemoveGame(groupedGame.gameId)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

                     {/* Languages Section */}
           <Card className="gaming-card bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Languages className="h-6 w-6" />
                Languages
              </CardTitle>
              <CardDescription className="text-gray-300">
                Add the languages you speak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {languages.map((lang, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={lang.language}
                    onChange={(e) => handleUpdateLanguage(index, 'language', e.target.value)}
                                         className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-md"
                  >
                    <option value="">Select language</option>
                                         {COMMON_LANGUAGES.map((language, index) => (
                       <option key={`${language}-${index}`} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                  <select
                    value={lang.level}
                    onChange={(e) => handleUpdateLanguage(index, 'level', e.target.value)}
                                         className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-md"
                  >
                                         {LANGUAGE_LEVELS.map((level, index) => (
                       <option key={`${level.value}-${index}`} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLanguage(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddLanguage}
                                 className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </CardContent>
          </Card>

                     {/* Tags Section */}
           <Card className="gaming-card bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Tags className="h-6 w-6" />
                Tags
              </CardTitle>
              <CardDescription className="text-gray-300">
                Add tags to describe your gaming style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Common Tags */}
              <div>
                <h4 className="text-white font-medium mb-2">Common Tags:</h4>
                <div className="flex flex-wrap gap-2">
                                     {COMMON_TAGS.map((tag, index) => (
                     <Button
                       key={`${tag}-${index}`}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTag(tag)}
                      disabled={tags.includes(tag)}
                      className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50 backdrop-blur-sm"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected Tags */}
              {tags.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Your Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                                         {tags.map((tag, index) => (
                       <Badge
                         key={`${tag}-${index}`}
                        className="bg-blue-600/20 text-blue-300 border-blue-500/30"
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 h-auto p-0 text-blue-300 hover:text-blue-200"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
} 