"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Gamepad2, 
  Languages, 
  Tags, 
  Edit,
  Plus,
  Loader2
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
              <TabsTrigger value="languages" className="text-white data-[state=active]:bg-green-600">
                Languages
              </TabsTrigger>
              <TabsTrigger value="edit" className="text-white data-[state=active]:bg-green-600">
                Edit Profile
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
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
                        <span className="text-gray-400">Languages</span>
                        <span className="text-white">{profile?.userLanguages.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tags</span>
                        <span className="text-white">{profile?.userTags.length || 0}</span>
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
                      {profile.userGames.map((userGame) => (
                        <Card key={userGame.id} className="gaming-card">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">{userGame.game.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="text-gray-400 text-sm">
                                {userGame.game.genre} • {userGame.game.platform}
                              </div>
                              <Badge className={
                                userGame.level === 'beginner' ? 'bg-green-600/20 text-green-300 border-green-500/30' :
                                userGame.level === 'intermediate' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' :
                                userGame.level === 'advanced' ? 'bg-orange-600/20 text-orange-300 border-orange-500/30' :
                                'bg-red-600/20 text-red-300 border-red-500/30'
                              }>
                                {userGame.level}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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

            {/* Languages Tab */}
            <TabsContent value="languages" className="mt-8">
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Languages className="h-6 w-6" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.userLanguages && profile.userLanguages.length > 0 ? (
                    <div className="space-y-4">
                      {profile.userLanguages.map((userLang) => (
                        <div key={userLang.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white font-medium">{userLang.language}</span>
                          <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                            {userLang.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Languages className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No languages added yet.</p>
                      <Button 
                        className="mt-4 gaming-button"
                        onClick={() => router.push('/onboarding')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Languages
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
          </Tabs>
        </div>
      </div>
    </div>
  )
} 