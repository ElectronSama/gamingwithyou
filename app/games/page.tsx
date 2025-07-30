import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Gamepad2, 
  Search,
  Filter,
  Star,
  Users,
  Calendar
} from "lucide-react"
import Link from "next/link"

// Mock data for games
const games = [
  {
    id: "1",
    name: "League of Legends",
    slug: "league-of-legends",
    description: "A multiplayer online battle arena game where teams compete to destroy the enemy base.",
    image: "/games/lol.jpg",
    genre: "MOBA",
    platform: "PC",
    rating: 4.5,
    players: "100M+",
    releaseDate: "2009-10-27"
  },
  {
    id: "2",
    name: "Counter-Strike 2",
    slug: "counter-strike-2",
    description: "The latest iteration of the tactical first-person shooter series.",
    image: "/games/cs2.jpg",
    genre: "FPS",
    platform: "PC",
    rating: 4.8,
    players: "50M+",
    releaseDate: "2023-09-27"
  },
  {
    id: "3",
    name: "Valorant",
    slug: "valorant",
    description: "A tactical first-person hero shooter game with unique character abilities.",
    image: "/games/valorant.jpg",
    genre: "FPS",
    platform: "PC",
    rating: 4.3,
    players: "25M+",
    releaseDate: "2020-06-02"
  },
  {
    id: "4",
    name: "Dota 2",
    slug: "dota-2",
    description: "A complex multiplayer online battle arena with deep strategic gameplay.",
    image: "/games/dota2.jpg",
    genre: "MOBA",
    platform: "PC",
    rating: 4.6,
    players: "15M+",
    releaseDate: "2013-07-09"
  },
  {
    id: "5",
    name: "Fortnite",
    slug: "fortnite",
    description: "A battle royale game with building mechanics and regular updates.",
    image: "/games/fortnite.jpg",
    genre: "Battle Royale",
    platform: "Multi-platform",
    rating: 4.2,
    players: "350M+",
    releaseDate: "2017-07-25"
  },
  {
    id: "6",
    name: "Minecraft",
    slug: "minecraft",
    description: "A sandbox game focused on building and exploration.",
    image: "/games/minecraft.jpg",
    genre: "Sandbox",
    platform: "Multi-platform",
    rating: 4.7,
    players: "140M+",
    releaseDate: "2011-11-18"
  }
]

const genres = ["All", "MOBA", "FPS", "Battle Royale", "Sandbox", "RPG", "Strategy"]
const platforms = ["All", "PC", "Console", "Mobile", "Multi-platform"]

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <section className="py-8 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <Gamepad2 className="inline mr-3 h-10 w-10 text-green-400" />
                Games Library
              </h1>
              <p className="text-xl text-gray-300">
                Discover and explore thousands of games
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Button asChild size="lg" className="gaming-button">
                <Link href="/admin/games/create">
                  Add New Game
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
                placeholder="Search games..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <Card key={game.id} className="gaming-card hover:transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-green-600 to-green-700 rounded-lg mb-4 flex items-center justify-center">
                    <Gamepad2 className="h-16 w-16 text-white" />
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-white text-xl">{game.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">{game.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30">
                      {game.genre}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                      {game.platform}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{game.players}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(game.releaseDate).getFullYear()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1 gaming-button">
                      <Link href={`/games/${game.slug}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                      <Link href={`/games/${game.slug}/gamers`}>
                        Find Players
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