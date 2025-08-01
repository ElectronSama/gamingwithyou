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
  
  // Search states
  const [gameSearchQuery, setGameSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Game[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState("intermediate")
  const [selectedPlatform, setSelectedPlatform] = useState("")

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
        setSelectedGames(profileData.userGames.map((ug: any) => ({
          gameId: ug.game.id,
          level: ug.level,
          name: ug.game.name,
          platform: ug.game.platform
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
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGameSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`/api/igdb/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.games || [])
      }
    } catch (error) {
      console.error('Error searching games:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleAddGame = (game: Game, level: string, platform?: string) => {
    const newGame = {
      gameId: game.id,
      level,
      name: game.name,
      platform: platform || game.platform || ""
    }
    
    // Check if game already exists
    const exists = selectedGames.find(g => g.gameId === game.id)
    if (!exists) {
      setSelectedGames([...selectedGames, newGame])
    }
    
    setGameSearchQuery("")
    setSearchResults([])
  }

  const handleRemoveGame = (gameId: string) => {
    setSelectedGames(selectedGames.filter(g => g.gameId !== gameId))
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

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
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
          <Card className="gaming-card">
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
                className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
            </CardContent>
          </Card>

          {/* Categories Section */}
          <Card className="gaming-card">
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
            </CardContent>
          </Card>

          {/* Games Section */}
          <Card className="gaming-card">
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
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for games..."
                    value={gameSearchQuery}
                    onChange={(e) => {
                      setGameSearchQuery(e.target.value)
                      handleGameSearch(e.target.value)
                    }}
                    className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/20 text-white rounded-md"
                  >
                    {SKILL_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {searchResults.map((game) => (
                      <div
                        key={game.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"
                        onClick={() => handleAddGame(game, selectedLevel)}
                      >
                        <div className="flex items-center gap-3">
                          {game.igdbCoverUrl && (
                            <img
                              src={game.igdbCoverUrl}
                              alt={game.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="text-white font-medium">{game.name}</div>
                            <div className="text-gray-400 text-sm">
                              {game.genre} • {game.platform}
                            </div>
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Games */}
                {selectedGames.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Your Games:</h4>
                    {selectedGames.map((game) => (
                      <div
                        key={game.gameId}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div>
                          <div className="text-white font-medium">{game.name}</div>
                          <div className="text-gray-400 text-sm">{game.platform}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            game.level === 'beginner' ? 'bg-green-600/20 text-green-300 border-green-500/30' :
                            game.level === 'intermediate' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' :
                            game.level === 'advanced' ? 'bg-orange-600/20 text-orange-300 border-orange-500/30' :
                            'bg-red-600/20 text-red-300 border-red-500/30'
                          }>
                            {game.level}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveGame(game.gameId)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Languages Section */}
          <Card className="gaming-card">
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
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/20 text-white rounded-md"
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
                    className="px-3 py-2 bg-white/5 border border-white/20 text-white rounded-md"
                  >
                    {LANGUAGE_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>
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
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </CardContent>
          </Card>

          {/* Tags Section */}
          <Card className="gaming-card">
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
                <div>
                  <h4 className="text-white font-medium mb-2">Your Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge
                        key={tag}
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
   )
 } 