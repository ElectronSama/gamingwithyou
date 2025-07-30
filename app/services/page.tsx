import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  Trophy,
  Gamepad2,
  Search,
  Filter,
  Plus,
  Crown,
  Shield,
  Zap,
  Heart,
  MessageCircle
} from "lucide-react"
import Link from "next/link"

// Mock data for services
const services = [
  {
    id: 1,
    title: "CS2 Coaching Session",
    provider: "ProGamer123",
    description: "Professional CS2 coaching for all skill levels. Improve your aim, game sense, and strategy.",
    price: 25,
    duration: "1 hour",
    rating: 4.9,
    reviews: 127,
    category: "Coaching",
    game: "CS2",
    level: "All Levels",
    availability: "Available"
  },
  {
    id: 2,
    title: "Valorant Rank Boosting",
    provider: "BoostMaster",
    description: "Fast and safe rank boosting service. Professional players, guaranteed results.",
    price: 50,
    duration: "2-3 days",
    rating: 4.8,
    reviews: 89,
    category: "Boosting",
    game: "Valorant",
    level: "Any Rank",
    availability: "Available"
  },
  {
    id: 3,
    title: "LoL Team Coaching",
    provider: "TeamCoach",
    description: "Team coordination and strategy coaching for League of Legends teams.",
    price: 75,
    duration: "2 hours",
    rating: 4.7,
    reviews: 45,
    category: "Coaching",
    game: "LoL",
    level: "Team",
    availability: "Available"
  },
  {
    id: 4,
    title: "Fortnite Building Practice",
    provider: "BuildPro",
    description: "Master building techniques in Fortnite with personalized training sessions.",
    price: 20,
    duration: "1 hour",
    rating: 4.6,
    reviews: 203,
    category: "Training",
    game: "Fortnite",
    level: "Beginner-Advanced",
    availability: "Available"
  },
  {
    id: 5,
    title: "Rocket League Mechanics",
    provider: "RLMechanic",
    description: "Learn advanced Rocket League mechanics: aerials, dribbling, and wall shots.",
    price: 30,
    duration: "1.5 hours",
    rating: 4.9,
    reviews: 156,
    category: "Training",
    game: "Rocket League",
    level: "Intermediate-Advanced",
    availability: "Available"
  },
  {
    id: 6,
    title: "Minecraft Server Setup",
    provider: "ServerExpert",
    description: "Professional Minecraft server setup with plugins, mods, and optimization.",
    price: 100,
    duration: "1 day",
    rating: 4.8,
    reviews: 67,
    category: "Setup",
    game: "Minecraft",
    level: "All Levels",
    availability: "Available"
  }
]

const categories = ["All", "Coaching", "Boosting", "Training", "Setup", "Custom"]

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Gaming Services
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find professional coaching, boosting, training, and custom services. 
              Connect with skilled gamers and improve your gameplay!
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
            </div>
            <div className="flex gap-2">
                              <Button className="bg-green-600/20 backdrop-blur-sm border border-green-500/30 text-white hover:bg-green-600/30">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="gaming-button">
                <Plus className="mr-2 h-4 w-4" />
                Offer Service
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "secondary"}
                className="cursor-pointer hover:bg-green-600/20"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="gaming-card border-0 bg-gradient-to-br from-green-600/10 to-green-800/10 hover:from-green-600/20 hover:to-green-800/20 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-green-600/50 text-green-200">
                      {service.category}
                    </Badge>
                    <Badge className="bg-green-600/50 text-green-200">
                      {service.availability}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-xl mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Provider Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-300 text-sm">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{service.provider}</span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 mr-1" />
                        <span className="text-sm">{service.rating}</span>
                        <span className="text-gray-400 text-sm ml-1">({service.reviews})</span>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="flex items-center text-gray-300 text-sm">
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      <span>{service.game}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>{service.level}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{service.duration}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-white font-bold">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="text-xl">${service.price}</span>
                      </div>
                      <Button className="gaming-button text-sm">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button className="gaming-button">
              Load More Services
            </Button>
          </div>
        </div>
      </section>

      {/* Service Categories */}
              <section className="py-16 bg-gradient-to-r from-green-600/20 to-green-800/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Service Categories
            </h2>
            <p className="text-xl text-gray-300">
              Choose from our wide range of professional gaming services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="gaming-card border-0 bg-gradient-to-br from-green-600/10 to-green-800/10 hover:from-green-600/20 hover:to-green-800/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Coaching</CardTitle>
                <CardDescription className="text-gray-300">
                  Professional coaching sessions to improve your skills, strategy, and game sense.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-green-600/10 to-green-800/10 hover:from-green-600/20 hover:to-green-800/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Boosting</CardTitle>
                <CardDescription className="text-gray-300">
                  Fast and safe rank boosting services with professional players.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-yellow-600/10 to-yellow-800/10 hover:from-yellow-600/20 hover:to-yellow-800/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Training</CardTitle>
                <CardDescription className="text-gray-300">
                  Specialized training sessions for specific skills and mechanics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-red-600/10 to-red-800/10 hover:from-red-600/20 hover:to-red-800/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Setup</CardTitle>
                <CardDescription className="text-gray-300">
                  Server setup, configuration, and technical support services.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-pink-600/10 to-pink-800/10 hover:from-pink-600/20 hover:to-pink-800/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Custom</CardTitle>
                <CardDescription className="text-gray-300">
                  Custom services tailored to your specific needs and requirements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-green-600/10 to-green-800/10 hover:from-green-600/20 hover:to-green-800/20 transition-all duration-300">
              <CardHeader className="text-center">
                                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Consultation</CardTitle>
                <CardDescription className="text-gray-300">
                  Expert advice and consultation for gaming strategies and improvement.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Offer Your Services?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Share your gaming expertise and earn money by offering coaching, training, or custom services to the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="gaming-button text-lg px-8 py-4">
              <Plus className="mr-3 h-6 w-6" />
              Start Offering Services
            </Button>
                            <Button className="bg-green-600/20 backdrop-blur-sm border border-green-500/30 text-white hover:bg-green-600/30 hover:border-green-400/50 text-lg px-8 py-4 transition-all duration-300">
              <MessageCircle className="mr-3 h-6 w-6" />
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 