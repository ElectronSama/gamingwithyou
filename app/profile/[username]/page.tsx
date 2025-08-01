"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Calendar, 
  Gamepad2, 
  Languages, 
  Tags, 
  Star,
  Clock,
  MessageCircle,
  MapPin,
  Globe,
  Award,
  Users,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Plus,
  Send
} from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface UserProfile {
  id: string
  username: string
  email: string
  bio?: string | null
  avatar?: string | null
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
  userAvailability: Array<{
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    price: number
    isActive: boolean
  }>
}

interface Review {
  id: string
  rating: number
  comment?: string | null
  createdAt: string
  reviewer: {
    id: string
    username: string
    avatar?: string | null
  }
}

interface ReviewsData {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [showGameDialog, setShowGameDialog] = useState(false)
  const [selectedGame, setSelectedGame] = useState<any>(null)

  useEffect(() => {
    if (username) {
      fetchUserProfile()
      fetchReviews()
    }
  }, [username])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/user/profile/${username}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'User not found')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setError('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true)
      const response = await fetch(`/api/user/profile/${username}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviewsData(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  const calculateAverageRating = () => {
    return reviewsData?.averageRating || 0
  }



  const formatAvailability = () => {
    if (!profile?.userAvailability || profile.userAvailability.length === 0) {
      return "No availability set"
    }
    
    const activeAvailability = profile.userAvailability.filter(av => av.isActive)
    if (activeAvailability.length === 0) return "No availability set"
    
    return `${activeAvailability.length} time slots available`
  }

  const handleSubmitReview = async () => {
    try {
      setSubmittingReview(true)
      setReviewError(null)
      
      const response = await fetch(`/api/user/profile/${username}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewForm)
      })

      if (response.ok) {
        setShowReviewDialog(false)
        setReviewForm({ rating: 5, comment: "" })
        fetchReviews() // Refresh reviews
      } else {
        const errorData = await response.json()
        setReviewError(errorData.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      setReviewError('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const canReview = session?.user && profile && session.user.id !== profile.id

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-400" />
            <span className="ml-3 text-white">Loading profile...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Profile not found</h3>
            <p className="text-gray-400 text-center max-w-md mb-4">
              {error || 'The user profile you are looking for does not exist.'}
            </p>
            <Button asChild className="gaming-button">
              <Link href="/gamers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Gamers
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4 border-white/20 text-white hover:bg-white/10">
            <Link href="/gamers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gamers
            </Link>
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm">{calculateAverageRating()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">{formatAvailability()}</span>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20">
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-green-600">Overview</TabsTrigger>
                <TabsTrigger value="games" className="text-white data-[state=active]:bg-green-600">Games</TabsTrigger>
                <TabsTrigger value="availability" className="text-white data-[state=active]:bg-green-600">Availability</TabsTrigger>
                <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-green-600">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-5 w-5" />
                      About {profile.username}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Bio */}
                      <div>
                        <h3 className="text-white font-semibold mb-2">Bio</h3>
                        <p className="text-gray-300">
                          {profile.bio || "No bio available"}
                        </p>
                      </div>

                      {/* Languages */}
                      <div>
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <Languages className="h-4 w-4" />
                          Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.userLanguages.length > 0 ? (
                            profile.userLanguages.map((lang) => (
                              <Badge key={lang.id} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                                {lang.language} ({lang.level})
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No languages listed</span>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <Tags className="h-4 w-4" />
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.userTags
                            .filter(tag => !tag.tag.startsWith('category:'))
                            .map((tag) => (
                              <Badge key={tag.id} variant="outline" className="border-green-500/30 text-green-300">
                                {tag.tag}
                              </Badge>
                            ))}
                          {profile.userTags.filter(tag => !tag.tag.startsWith('category:')).length === 0 && (
                            <span className="text-gray-500 text-sm">No tags listed</span>
                          )}
                        </div>
                      </div>

                      {/* Member Since */}
                      <div>
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Member Since
                        </h3>
                        <p className="text-gray-300">
                          {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="games" className="mt-6">
                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5" />
                      Games
                    </CardTitle>
                  </CardHeader>
                                     <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                       {profile.userGames.length > 0 ? (
                         (() => {
                           // Group games by name to avoid duplicates
                           const gameGroups = profile.userGames.reduce((groups, userGame) => {
                             const gameName = userGame.game.name
                             if (!groups[gameName]) {
                               groups[gameName] = []
                             }
                             groups[gameName].push(userGame)
                             return groups
                           }, {} as Record<string, typeof profile.userGames>)
                           
                           return Object.entries(gameGroups).map(([gameName, userGames]) => {
                             const firstGame = userGames[0]
                             const platforms = userGames.map(ug => ug.platform).filter(Boolean)
                             const levels = userGames.map(ug => ug.level)
                             const uniqueLevels = [...new Set(levels)]
                             
                             return (
                                                               <Card key={firstGame.id} className="bg-white/5 border-white/20 hover:bg-white/10 transition-colors">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-semibold text-lg truncate">{gameName}</h4>
                                        {platforms.length > 0 && (
                                          <p className="text-gray-400 text-sm mt-1 truncate">
                                            {platforms.join(', ')}
                                          </p>
                                        )}
                                        {uniqueLevels.length > 0 && (
                                          <p className="text-gray-500 text-xs mt-1">
                                            Levels: {uniqueLevels.join(', ')}
                                          </p>
                                        )}
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="border-green-500/30 text-green-300 hover:bg-green-500/20 ml-3 flex-shrink-0"
                                        onClick={() => {
                                          setSelectedGame({ 
                                            game: firstGame.game, 
                                            userGames: userGames,
                                            platforms: platforms,
                                            levels: uniqueLevels
                                          })
                                          setShowGameDialog(true)
                                        }}
                                      >
                                        View
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                             )
                           })
                         })()
                       ) : (
                         <div className="col-span-full text-center py-8">
                           <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                           <p className="text-gray-400">No games listed</p>
                         </div>
                       )}
                     </div>
                   </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability" className="mt-6">
                <Card className="gaming-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Availability & Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.userAvailability && profile.userAvailability.length > 0 ? (
                      <div className="space-y-4">
                        {profile.userAvailability
                          .filter(av => av.isActive)
                          .map((availability) => (
                            <Card key={availability.id} className="bg-white/5 border-white/20">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-white font-semibold">{dayNames[availability.dayOfWeek]}</h4>
                                    <p className="text-gray-400 text-sm">
                                      {availability.startTime} - {availability.endTime}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-green-400 font-semibold">${availability.price}/hr</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No availability set</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card className="gaming-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Reviews
                      </CardTitle>
                      {canReview && (
                        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                          <DialogTrigger asChild>
                            <Button className="gaming-button">
                              <Plus className="h-4 w-4 mr-2" />
                              Write Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Write a Review</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Share your experience with {profile?.username}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-white text-sm font-medium mb-2 block">Rating</label>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                      className={`text-2xl ${
                                        star <= reviewForm.rating 
                                          ? 'text-yellow-400' 
                                          : 'text-gray-400'
                                      } hover:text-yellow-400 transition-colors`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="text-white text-sm font-medium mb-2 block">Comment (optional)</label>
                                <Textarea
                                  value={reviewForm.comment}
                                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                  placeholder="Share your experience..."
                                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                                  rows={4}
                                />
                              </div>
                              {reviewError && (
                                <p className="text-red-400 text-sm">{reviewError}</p>
                              )}
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setShowReviewDialog(false)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSubmitReview}
                                disabled={submittingReview}
                                className="gaming-button"
                              >
                                {submittingReview ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4 mr-2" />
                                )}
                                Submit Review
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {reviewsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-green-400" />
                        <span className="ml-2 text-white">Loading reviews...</span>
                      </div>
                    ) : reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviewsData.reviews.map((review) => (
                          <Card key={review.id} className="bg-white/5 border-white/20">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                                      <User className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-white font-medium">{review.reviewer.username}</span>
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-4 w-4 ${
                                            star <= review.rating 
                                              ? 'text-yellow-400 fill-current' 
                                              : 'text-gray-400'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  {review.comment && (
                                    <p className="text-gray-300 text-sm">{review.comment}</p>
                                  )}
                                  <p className="text-gray-500 text-xs mt-2">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No reviews yet</p>
                        <p className="text-gray-500 text-sm mt-2">
                          {canReview ? 'Be the first to review this gamer!' : 'No reviews available'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full gaming-button">
                  <Link href={`/profile/${profile.username}/book`}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Book Session
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  <Link href={`/profile/${profile.username}/message`}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Games</span>
                  <span className="text-white font-semibold">{profile.userGames.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Languages</span>
                  <span className="text-white font-semibold">{profile.userLanguages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Available Slots</span>
                  <span className="text-white font-semibold">
                    {profile.userAvailability?.filter(av => av.isActive).length || 0}
                  </span>
                </div>
                                 <div className="flex items-center justify-between">
                   <span className="text-gray-400">Member Since</span>
                   <span className="text-white font-semibold">
                     {new Date(profile.createdAt).getFullYear()}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-400">Reviews</span>
                   <span className="text-white font-semibold">
                     {reviewsData?.totalReviews || 0}
                   </span>
                 </div>
              </CardContent>
            </Card>
                     </div>
         </div>
       </div>

       {/* Game Details Modal */}
       <Dialog open={showGameDialog} onOpenChange={setShowGameDialog}>
         <DialogContent className="bg-gray-900 border-gray-700">
           <DialogHeader>
             <DialogTitle className="text-white flex items-center gap-2">
               <Gamepad2 className="h-5 w-5" />
               {selectedGame?.game.name}
             </DialogTitle>
             <DialogDescription className="text-gray-400">
               Game details and player information
             </DialogDescription>
           </DialogHeader>
                       {selectedGame && (
              <div className="space-y-4">
                {/* Player Levels */}
                <div>
                  <h4 className="text-white font-semibold mb-2">Player Levels</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGame.levels?.map((level, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                {selectedGame.platforms && selectedGame.platforms.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGame.platforms.map((platform, index) => (
                        <Badge key={index} variant="outline" className="border-blue-500/30 text-blue-300">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Game Genre */}
                {selectedGame.game.genre && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Genre</h4>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                      {selectedGame.game.genre}
                    </Badge>
                  </div>
                )}
                
                {/* Game Platform */}
                {selectedGame.game.platform && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Game Platform</h4>
                    <Badge variant="outline" className="border-orange-500/30 text-orange-300">
                      {selectedGame.game.platform}
                    </Badge>
                  </div>
                )}

                {/* Detailed Breakdown */}
                {selectedGame.userGames && selectedGame.userGames.length > 1 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Detailed Breakdown</h4>
                    <div className="space-y-2">
                      {selectedGame.userGames.map((userGame, index) => (
                        <div key={index} className="bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">
                              {userGame.platform || 'No platform'} - {userGame.level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
           <DialogFooter>
             <Button
               variant="outline"
               onClick={() => setShowGameDialog(false)}
               className="border-gray-600 text-gray-300 hover:bg-gray-800"
             >
               Close
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </div>
   )
 } 