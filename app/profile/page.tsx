"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Save, User, Mail, Lock, AlertTriangle, Eye, EyeOff, Settings, Gamepad2, Languages, Tags, Camera, Upload, Star, Plus, X, Loader2, Image } from "lucide-react"

interface Game {
      id: string
      name: string
  slug: string
      genre?: string | null
      platform?: string | null
  platforms?: Array<{id: number, name: string}> | null
  igdbCoverUrl?: string | null
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

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Account settings states
  const [savingAccount, setSavingAccount] = useState(false)
  const [accountForm, setAccountForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [accountErrors, setAccountErrors] = useState<{[key: string]: string}>({})
  
  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmForm, setConfirmForm] = useState({
    username: "",
    email: "",
    newPassword: ""
  })
  const [confirmErrors, setConfirmErrors] = useState<{[key: string]: string}>({})
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  // Sidebar and section states
  const [activeSection, setActiveSection] = useState("account")
  
  // Onboarding form states
  const [onboardingForm, setOnboardingForm] = useState({
    bio: "",
    games: [] as string[],
    languages: [] as string[]
  })
  const [onboardingErrors, setOnboardingErrors] = useState<{[key: string]: string}>({})
  const [savingOnboarding, setSavingOnboarding] = useState(false)
  
  // Enhanced onboarding states
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
  
  // Profile picture states
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', session)
    
    if (session?.user && status === 'authenticated') {
      console.log('Session is authenticated, loading profile data')
      setAccountForm({
        username: session.user.username || "",
        email: session.user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      
      // Load profile data from API
      fetchProfileData()
    }
  }, [session, status])

  const fetchProfileData = async () => {
    try {
      console.log('Fetching profile data...')
      console.log('Session user:', session?.user)
      console.log('Session user email:', session?.user?.email)
      
      // Get session token
      const token = await fetch('/api/auth/session')
      const sessionData = await token.json()
      console.log('Session data from API:', sessionData)
      
      const response = await fetch('/api/user/profile-data', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Profile data received:', data)
        
        const profile = data.profile
        
        // Set onboarding form data
        setOnboardingForm({
          bio: profile.bio || "",
          games: profile.userGames?.map((ug: any) => ug.game.name) || [],
          languages: profile.userLanguages?.map((ul: any) => ul.language) || []
        })
        
        // Set enhanced onboarding data
        setSelectedCategories(
          profile.userTags
            ?.filter((ut: any) => ut.tag.startsWith('category:'))
            ?.map((ut: any) => ut.tag.replace('category:', '')) || []
        )
        
        setSelectedGames(
          profile.userGames?.map((ug: any) => ({
            gameId: ug.game.id.toString(),
            level: ug.level,
            name: ug.game.name,
            platform: ug.platform
          })) || []
        )
        
        setLanguages(
          profile.userLanguages?.map((ul: any) => ({
            language: ul.language,
            level: ul.level
          })) || []
        )
        
        setTags(
          profile.userTags
            ?.filter((ut: any) => !ut.tag.startsWith('category:'))
            ?.map((ut: any) => ut.tag) || []
        )
        
        // Set profile image if exists
        if (profile.avatar) {
          setProfileImage(profile.avatar)
        }
        
        console.log('Profile data loaded successfully')
      } else {
        console.error('Failed to fetch profile data:', response.status)
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }

  const validateAccountForm = () => {
    const errors: {[key: string]: string} = {}

    if (!accountForm.username.trim()) {
      errors.username = "Username is required"
    } else if (accountForm.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(accountForm.username)) {
      errors.username = "Username can only contain letters, numbers, and underscores"
    }

    if (!accountForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountForm.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (accountForm.newPassword && accountForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters"
    }

    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setAccountErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateConfirmForm = () => {
    const errors: {[key: string]: string} = {}

    // Check if username matches
    if (accountForm.username !== confirmForm.username) {
      errors.username = "Username does not match"
    }

    // Check if email matches
    if (accountForm.email !== confirmForm.email) {
      errors.email = "Email does not match"
    }

    // Check if new password matches (only if new password was entered)
    if (accountForm.newPassword && accountForm.newPassword !== confirmForm.newPassword) {
      errors.newPassword = "New password does not match"
    }

    // Check if new password is required when account form has it
    if (accountForm.newPassword && !confirmForm.newPassword) {
      errors.newPassword = "Please confirm your new password"
    }

    setConfirmErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveClick = () => {
    if (!validateAccountForm()) return

    // Check if any changes were made
    const hasChanges = 
      accountForm.username !== (session?.user?.username || "") ||
      accountForm.email !== (session?.user?.email || "") ||
      accountForm.newPassword

    if (!hasChanges) {
      alert('No changes were made.')
      return
    }

    // Set confirmation form with changed values only
    setConfirmForm({
      username: accountForm.username,
      email: accountForm.email,
      newPassword: accountForm.newPassword
    })
    setConfirmErrors({})
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    if (!validateConfirmForm()) return

    setSavingAccount(true)
    try {
      const response = await fetch('/api/user/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: accountForm.username,
          email: accountForm.email,
          currentPassword: accountForm.currentPassword || undefined,
          newPassword: accountForm.newPassword || undefined
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setShowConfirmModal(false)
          alert('Account updated successfully!')
          // Clear password fields after successful save
          setAccountForm(prev => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          }))
          // Clear confirmation form
          setConfirmForm({
            username: "",
            email: "",
            newPassword: ""
          })
          setConfirmErrors({})
        } else {
          setAccountErrors(data.errors || {})
          setShowConfirmModal(false)
        }
      } else {
        const errorData = await response.json()
        setAccountErrors(errorData.errors || {})
        setShowConfirmModal(false)
      }
    } catch (error) {
      console.error('Error updating account:', error)
      setAccountErrors({ general: 'Failed to update account. Please try again.' })
      setShowConfirmModal(false)
    } finally {
      setSavingAccount(false)
    }
  }

  const handleCancelConfirm = () => {
    setShowConfirmModal(false)
    setConfirmForm({
      username: "",
      email: "",
      newPassword: ""
    })
    setConfirmErrors({})
  }

  // Onboarding functions
  const validateOnboardingForm = () => {
    const errors: {[key: string]: string} = {}

    if (!onboardingForm.bio.trim()) {
      errors.bio = "Bio is required"
    } else if (onboardingForm.bio.length > 500) {
      errors.bio = "Bio must be less than 500 characters"
    }

    if (onboardingForm.games.length === 0) {
      errors.games = "At least one game is required"
    }

    if (onboardingForm.languages.length === 0) {
      errors.languages = "At least one language is required"
    }

    setOnboardingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleOnboardingSave = async () => {
    setSavingOnboarding(true)
    try {
      const response = await fetch('/api/user/profile-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: onboardingForm.bio,
          categories: selectedCategories,
          games: selectedGames,
          languages,
          tags
        }),
      })

      if (response.ok) {
        alert('Profile updated successfully!')
      } else {
        const errorData = await response.json()
        setOnboardingErrors(errorData.errors || {})
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setOnboardingErrors({ general: 'Failed to update profile. Please try again.' })
    } finally {
      setSavingOnboarding(false)
    }
  }

  const addGame = (game: string) => {
    if (game.trim() && !onboardingForm.games.includes(game.trim())) {
      setOnboardingForm(prev => ({
        ...prev,
        games: [...prev.games, game.trim()]
      }))
    }
  }

  const removeGame = (gameToRemove: string) => {
    setOnboardingForm(prev => ({
      ...prev,
      games: prev.games.filter(game => game !== gameToRemove)
    }))
  }

  const addLanguage = (language: string) => {
    if (language.trim() && !onboardingForm.languages.includes(language.trim())) {
      setOnboardingForm(prev => ({
        ...prev,
        languages: [...prev.languages, language.trim()]
      }))
    }
  }

  const removeLanguage = (languageToRemove: string) => {
    setOnboardingForm(prev => ({
      ...prev,
      languages: prev.languages.filter(language => language !== languageToRemove)
    }))
  }

  // Enhanced game functions
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
      return
    } else {
      setSelectedGames(prev => [...prev, { 
        gameId: game.id, 
        level,
        name: game.name,
        platform: selectedPlatform
      }])
    }
    
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
    if (platform && level) {
      setSelectedGames(prev => prev.filter(g => 
        !(g.gameId === gameId && g.platform === platform && g.level === level)
      ))
    } else {
      setSelectedGames(prev => prev.filter(g => g.gameId !== gameId))
    }
  }

  const handleGameSelect = (game: Game) => {
    setSelectedGameForSetup(game)
    setSelectedPlatforms([])
    setSelectedSkillLevels({})
    setShowGameSetupModal(true)
  }

  const handleQuickAdd = (game: Game) => {
    const defaultPlatform = game.platform || 'PC'
    handleAddGame(game, 'beginner', defaultPlatform)
  }

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
    
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

  const handleAddGameFromModal = () => {
    if (!selectedGameForSetup || selectedPlatforms.length === 0) {
      alert('Please select at least one platform')
      return
    }

    selectedPlatforms.forEach(platform => {
      const skillLevel = selectedSkillLevels[platform] || "beginner"
      handleAddGame(selectedGameForSetup, skillLevel, platform)
    })

    setShowGameSetupModal(false)
    setSelectedGameForSetup(null)
    setSelectedPlatforms([])
    setSelectedSkillLevels({})
    setGameSearchQuery("")
    setSearchResults([])
  }

  // Enhanced language functions
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

  // Enhanced tag functions
  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Category functions
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Profile picture functions
  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setProfileImage(data.imageUrl)
        alert('Profile picture updated successfully!')
        setShowImageModal(false)
      } else {
        const errorData = await response.json()
        alert(`Failed to upload image: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white text-xl">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Profile Settings
          </h1>
          <p className="text-xl text-gray-300">
            Manage your account and profile information
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="gaming-card">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveSection("account")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeSection === "account"
                        ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                Account Settings
                  </button>
                  
                  <button
                    onClick={() => setActiveSection("profile")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeSection === "profile"
                        ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    Profile Information
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === "account" && (
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Account Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                  <div className="space-y-6">
                    {accountErrors.general && (
                      <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-300 text-sm">{accountErrors.general}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-white flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={accountForm.username}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, username: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          placeholder="Enter username"
                        />
                        {accountErrors.username && (
                          <p className="text-red-400 text-xs">{accountErrors.username}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={accountForm.email}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          placeholder="Enter email"
                        />
                        {accountErrors.email && (
                          <p className="text-red-400 text-xs">{accountErrors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-white flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={accountForm.currentPassword}
                            onChange={(e) => setAccountForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                            placeholder="Enter current password (required for changes)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {accountErrors.currentPassword && (
                          <p className="text-red-400 text-xs">{accountErrors.currentPassword}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-white">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={accountForm.newPassword}
                              onChange={(e) => setAccountForm(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                              placeholder="Enter new password (optional)"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {accountErrors.newPassword && (
                            <p className="text-red-400 text-xs">{accountErrors.newPassword}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={accountForm.confirmPassword}
                              onChange={(e) => setAccountForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {accountErrors.confirmPassword && (
                            <p className="text-red-400 text-xs">{accountErrors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="gaming-button w-full"
                      onClick={handleSaveClick}
                      disabled={savingAccount}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                    </CardContent>
                  </Card>
            )}

            {activeSection === "profile" && (
                <div className="space-y-6">
                {onboardingErrors.general && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 text-sm">{onboardingErrors.general}</p>
                  </div>
                )}

                {/* Profile Picture Section */}
                  <Card className="gaming-card">
                    <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Image className="h-6 w-6" />
                      Profile Picture
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Upload a profile picture to personalize your account
                    </CardDescription>
                    </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      {/* Current Profile Picture */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                          {profileImage ? (
                            <img 
                              src={profileImage} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (session?.user as any)?.image ? (
                            <img 
                              src={(session?.user as any).image} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-12 w-12 text-white" />
                          )}
                      </div>
                      </div>
                      
                      {/* Upload Controls */}
                      <div className="flex-1">
                        <div className="space-y-3">
                          <Button
                            onClick={() => setShowImageModal(true)}
                            className="gaming-button"
                            disabled={uploadingImage}
                          >
                            {uploadingImage ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            {uploadingImage ? 'Uploading...' : 'Change Picture'}
                          </Button>
                          
                          <p className="text-gray-400 text-sm">
                            Supported formats: JPG, PNG, GIF (max 5MB)
                          </p>
                      </div>
                      </div>
                      </div>
                    </CardContent>
                  </Card>

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
                      value={onboardingForm.bio}
                      onChange={(e) => setOnboardingForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="min-h-[120px] bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400"
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
                      
                      <Button 
                  className="gaming-button w-full"
                  onClick={handleOnboardingSave}
                  disabled={savingOnboarding}
                >
                  {savingOnboarding ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Profile
                      </Button>
                        </div>
                      )}
          </div>
        </div>
      </div>

      {/* Game Setup Modal */}
      {showGameSetupModal && selectedGameForSetup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
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
                  Array.from(new Set(selectedGameForSetup.platforms.map(p => p.name))) : 
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

      {/* Image Upload Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Image className="h-6 w-6 text-emerald-400" />
              Upload Profile Picture
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose an image to upload as your profile picture
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Drag & Drop Area */}
            <div
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-emerald-400/50 transition-colors cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
                disabled={uploadingImage}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="space-y-3">
                  <div className="mx-auto w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Drop image here or click to browse</p>
                    <p className="text-gray-400 text-sm mt-1">
                      JPG, PNG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </label>
            </div>
            
            {uploadingImage && (
              <div className="flex items-center gap-3 p-3 bg-emerald-600/20 border border-emerald-500/30 rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                <span className="text-emerald-300">Uploading image...</span>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowImageModal(false)}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                disabled={uploadingImage}
              >
                Cancel
              </Button>
                        </div>
                      </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Eye className="h-6 w-6 text-emerald-400" />
              Confirm Changes
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Please confirm your changes by re-entering the modified information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {confirmErrors.general && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{confirmErrors.general}</p>
              </div>
            )}
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                <Label htmlFor="confirmUsername" className="text-white flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Confirm Username
                </Label>
                          <Input
                  id="confirmUsername"
                  value={confirmForm.username}
                  onChange={(e) => setConfirmForm(prev => ({ ...prev, username: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="Re-enter username"
                          />
                {confirmErrors.username && (
                  <p className="text-red-400 text-xs">{confirmErrors.username}</p>
                          )}
                        </div>
                        
                          <div className="space-y-2">
                <Label htmlFor="confirmEmail" className="text-white flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Confirm Email
                </Label>
                            <Input
                  id="confirmEmail"
                  type="email"
                  value={confirmForm.email}
                  onChange={(e) => setConfirmForm(prev => ({ ...prev, email: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="Re-enter email"
                            />
                {confirmErrors.email && (
                  <p className="text-red-400 text-xs">{confirmErrors.email}</p>
                            )}
                          </div>
                          
              {accountForm.newPassword && (
                          <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword" className="text-white flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confirm New Password
                  </Label>
                  <div className="relative">
                            <Input
                      id="confirmNewPassword"
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmForm.newPassword}
                      onChange={(e) => setConfirmForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                      placeholder="Re-enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmErrors.newPassword && (
                    <p className="text-red-400 text-xs">{confirmErrors.newPassword}</p>
                            )}
                          </div>
              )}
                      </div>
                      
            <div className="flex gap-3 pt-4">
                        <Button 
                className="gaming-button flex-1"
                onClick={handleConfirmSave}
                          disabled={savingAccount}
                        >
                          {savingAccount ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                Confirm & Save
                        </Button>
                        
                        <Button 
                          variant="outline"
                className="border-white/20 text-white hover:bg-white/10 flex-1"
                onClick={handleCancelConfirm}
                          disabled={savingAccount}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 