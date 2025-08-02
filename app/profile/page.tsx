"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Gamepad2, 
  Tags, 
  Edit,
  Plus,
  Loader2,
  Settings,
  Lock,
  Save,
  X
} from "lucide-react"

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

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  
  // Account settings states
  const [editingAccount, setEditingAccount] = useState(false)
  const [savingAccount, setSavingAccount] = useState(false)
  const [accountForm, setAccountForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [accountErrors, setAccountErrors] = useState<{[key: string]: string}>({})
  
  // Modal states
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEditingAccount = () => {
    if (profile) {
      setAccountForm({
        username: profile.username,
        email: profile.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setAccountErrors({})
      setEditingAccount(true)
    }
  }

  const cancelEditingAccount = () => {
    setEditingAccount(false)
    setAccountForm({
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setAccountErrors({})
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

  const handleAccountSave = async () => {
    if (!validateAccountForm()) return

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
          setEditingAccount(false)
          fetchProfile() // Refresh profile data
          alert('Account updated successfully!')
        } else {
          setAccountErrors(data.errors || {})
        }
      } else {
        const errorData = await response.json()
        setAccountErrors(errorData.errors || {})
      }
    } catch (error) {
      console.error('Error updating account:', error)
      setAccountErrors({ general: 'Failed to update account. Please try again.' })
    } finally {
      setSavingAccount(false)
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gaming Profile
          </h1>
          <p className="text-xl text-gray-300">
            Manage your gaming preferences and profile
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-green-600">
                Overview
              </TabsTrigger>
              <TabsTrigger value="games" className="text-white data-[state=active]:bg-green-600">
                Games
              </TabsTrigger>
              <TabsTrigger value="edit" className="text-white data-[state=active]:bg-green-600">
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="text-white data-[state=active]:bg-green-600">
                Account Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-1">
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="h-6 w-6" />
                        About {profile?.username || session.user?.username}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {profile?.bio ? (
                        <p className="text-gray-300 leading-relaxed">
                          {profile.bio}
                        </p>
                      ) : (
                        <p className="text-gray-400 italic">No bio added yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Username</span>
                        <span className="text-white">{profile?.username || session.user?.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email</span>
                        <span className="text-white">{session.user?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Member since</span>
                        <span className="text-white">
                          {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Role</span>
                        <span className="text-white">{session.user?.isAdmin ? "Admin" : "User"}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  <Card className="gaming-card">
                    <CardHeader>
                      <CardTitle className="text-white">Profile Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Games</span>
                        <span className="text-white">{profile?.userGames.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Categories</span>
                        <span className="text-white">
                          {profile?.userTags.filter(tag => tag.tag.startsWith('category:')).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tags</span>
                        <span className="text-white">
                          {profile?.userTags.filter(tag => !tag.tag.startsWith('category:')).length || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Games Tab */}
            <TabsContent value="games" className="mt-8">
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gamepad2 className="h-6 w-6" />
                    Your Games
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.userGames && profile.userGames.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(() => {
                        // Group games by game ID and collect all platforms
                        const groupedGames = profile.userGames.reduce((acc, userGame) => {
                          const gameId = userGame.game.id;
                          if (!acc[gameId]) {
                            acc[gameId] = {
                              game: userGame.game,
                              entries: []
                            };
                          }
                          
                          // Add this platform/level combination if it's not already added
                          const platform = userGame.platform || userGame.game.platform || 'Unknown Platform';
                          const existingEntry = acc[gameId].entries.find(entry => 
                            entry.platform === platform && entry.level === userGame.level
                          );
                          
                          if (!existingEntry) {
                            acc[gameId].entries.push({
                              platform: platform,
                              level: userGame.level
                            });
                          }
                          
                          return acc;
                        }, {} as Record<string, { game: any, entries: Array<{ platform: string | null, level: string }> }>);

                        // Debug: Log the userGames data to see what platforms are saved
                        console.log('UserGames data:', profile.userGames);
                        console.log('Grouped games:', groupedGames);
                        
                        return Object.values(groupedGames).map((groupedGame, index) => (
                          <Card key={`${groupedGame.game.id}-${index}`} className="gaming-card">
                            <CardHeader>
                              <CardTitle className="text-white text-lg">{groupedGame.game.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center">
                                <div className="text-gray-400 text-sm">
                                  {groupedGame.game.genre} • {groupedGame.entries.length} platform(s)
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-white/20 text-white hover:bg-white/10"
                                  onClick={() => {
                                    setSelectedGame(groupedGame)
                                    setIsModalOpen(true)
                                  }}
                                >
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ));
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No games added yet.</p>
                      <Button 
                        className="mt-4 gaming-button"
                        onClick={() => router.push('/onboarding')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Games
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>



            {/* Edit Profile Tab */}
            <TabsContent value="edit" className="mt-8">
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Edit className="h-6 w-6" />
                    Edit Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-gray-300">
                      Want to update your profile information? You can edit your bio, games, languages, and more.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        className="gaming-button"
                        onClick={() => router.push('/profile/edit')}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => router.push('/')}
                      >
                        Back to Home
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Settings Tab */}
            <TabsContent value="account" className="mt-8">
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Account Settings
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Update your account information, email, and password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!editingAccount ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Username</span>
                            <span className="text-white">{profile?.username}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Email</span>
                            <span className="text-white">{profile?.email}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Password</span>
                            <span className="text-white">••••••••</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="gaming-button"
                        onClick={startEditingAccount}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Account Settings
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {accountErrors.general && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                          <p className="text-red-300 text-sm">{accountErrors.general}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-white">Username</Label>
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
                          <Label htmlFor="email" className="text-white">Email</Label>
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
                          <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={accountForm.currentPassword}
                            onChange={(e) => setAccountForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                            placeholder="Enter current password (required for changes)"
                          />
                          {accountErrors.currentPassword && (
                            <p className="text-red-400 text-xs">{accountErrors.currentPassword}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-white">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={accountForm.newPassword}
                              onChange={(e) => setAccountForm(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                              placeholder="Enter new password (optional)"
                            />
                            {accountErrors.newPassword && (
                              <p className="text-red-400 text-xs">{accountErrors.newPassword}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={accountForm.confirmPassword}
                              onChange={(e) => setAccountForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                              placeholder="Confirm new password"
                            />
                            {accountErrors.confirmPassword && (
                              <p className="text-red-400 text-xs">{accountErrors.confirmPassword}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          className="gaming-button"
                          onClick={handleAccountSave}
                          disabled={savingAccount}
                        >
                          {savingAccount ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={cancelEditingAccount}
                          disabled={savingAccount}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Game Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedGame?.game.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Platform and skill levels
            </DialogDescription>
          </DialogHeader>
          
          {selectedGame && (
            <div className="space-y-4">
              <div className="space-y-3">
                {Array.from(new Set(selectedGame.entries.map((entry: any) => `${entry.platform}-${entry.level}`))).map((uniqueKey: string, entryIndex: number) => {
                  const [platform, level] = uniqueKey.split('-');
                  return (
                    <div key={`modal-${selectedGame.game.id}-entry-${entryIndex}`} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">{platform}</div>
                          <div className="text-gray-400 text-sm">{selectedGame.game.genre}</div>
                        </div>
                      </div>
                      <Badge className={
                        level === 'beginner' ? 'bg-green-600/20 text-green-300 border-green-500/30' :
                        level === 'intermediate' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' :
                        level === 'advanced' ? 'bg-orange-600/20 text-orange-300 border-orange-500/30' :
                        'bg-red-600/20 text-red-300 border-red-500/30'
                      }>
                        {level}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 