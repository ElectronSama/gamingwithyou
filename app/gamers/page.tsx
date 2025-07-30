import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Search,
  Filter,
  Star,
  Gamepad2,
  Clock,
  DollarSign,
  MessageCircle
} from "lucide-react"
import Link from "next/link"

// Mock data for gamers
const gamers = [
  {
    id: "1",
    username: "ProGamer123",
    avatar: "/avatars/user1.jpg",
    bio: "Professional League of Legends player with 5 years of experience. Available for coaching and duo queue.",
    games: ["League of Legends", "Valorant"],
    languages: ["English", "Spanish"],
    rating: 4.8,
    hourlyRate: 25,
    availability: "Weekdays 6PM-10PM",
    tags: ["Professional", "Coach", "Friendly"]
  },
  {
    id: "2",
    username: "CS2Master",
    avatar: "/avatars/user2.jpg",
    bio: "Counter-Strike 2 enthusiast. Looking for teammates for competitive matches.",
    games: ["Counter-Strike 2", "Valorant"],
    languages: ["English", "German"],
    rating: 4.6,
    hourlyRate: 15,
    availability: "Weekends 2PM-8PM",
    tags: ["Competitive", "Team Player", "Experienced"]
  },
  {
    id: "3",
    username: "MinecraftBuilder",
    avatar: "/avatars/user3.jpg",
    bio: "Creative Minecraft builder and redstone engineer. Available for collaborative projects.",
    games: ["Minecraft", "Terraria"],
    languages: ["English", "French"],
    rating: 4.9,
    hourlyRate: 20,
    availability: "Flexible schedule",
    tags: ["Creative", "Builder", "Redstone"]
  },
  {
    id: "4",
    username: "FortnitePro",
    avatar: "/avatars/user4.jpg",
    bio: "Fortnite battle royale specialist. Can help with building techniques and strategies.",
    games: ["Fortnite", "Apex Legends"],
    languages: ["English"],
    rating: 4.4,
    hourlyRate: 18,
    availability: "Evenings 7PM-11PM",
    tags: ["Battle Royale", "Builder", "Strategic"]
  },
  {
    id: "5",
    username: "Dota2Veteran",
    avatar: "/avatars/user5.jpg",
    bio: "Dota 2 veteran with 10+ years experience. Available for coaching and team formation.",
    games: ["Dota 2", "League of Legends"],
    languages: ["English", "Russian"],
    rating: 4.7,
    hourlyRate: 30,
    availability: "Weekdays 5PM-9PM",
    tags: ["Veteran", "Coach", "Team Leader"]
  },
  {
    id: "6",
    username: "CasualGamer",
    avatar: "/avatars/user6.jpg",
    bio: "Casual gamer looking for friendly matches. No pressure, just fun!",
    games: ["Minecraft", "Stardew Valley"],
    languages: ["English", "Italian"],
    rating: 4.2,
    hourlyRate: 10,
    availability: "Weekends only",
    tags: ["Casual", "Friendly", "Relaxed"]
  }
]

const games = ["All", "League of Legends", "Counter-Strike 2", "Valorant", "Minecraft", "Fortnite", "Dota 2"]
const languages = ["All", "English", "Spanish", "German", "French", "Russian", "Italian"]

export default function GamersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <section className="py-8 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <Users className="inline mr-3 h-10 w-10 text-purple-400" />
                Find Gamers
              </h1>
              <p className="text-xl text-gray-300">
                Connect with skilled players and gaming partners
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Button asChild size="lg" className="gaming-button">
                <Link href="/create-listing">
                  Create Listing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search gamers..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Game Filter */}
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-gray-400" />
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                {games.map(game => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Gamers Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gamers.map((gamer) => (
              <Card key={gamer.id} className="gaming-card hover:transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl">{gamer.username}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">{gamer.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300">
                    {gamer.bio}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Games */}
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Games:</h4>
                    <div className="flex flex-wrap gap-2">
                      {gamer.games.map(game => (
                        <Badge key={game} variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                          {game}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Languages:</h4>
                    <div className="flex flex-wrap gap-2">
                      {gamer.languages.map(language => (
                        <Badge key={language} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {gamer.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="border-green-500/30 text-green-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Availability & Rate */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{gamer.availability}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${gamer.hourlyRate}/hr</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1 gaming-button">
                      <Link href={`/profile/${gamer.username}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                      <Link href={`/profile/${gamer.username}/book`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Book Session
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 