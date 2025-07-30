import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Star,
  MapPin,
  Gamepad2,
  Filter,
  Search,
  Plus
} from "lucide-react"
import Link from "next/link"

// Mock data for events
const events = [
  {
    id: 1,
    title: "CS2 Championship 2024",
    description: "Join the biggest CS2 tournament of the year with a $10,000 prize pool!",
    date: "2024-12-15",
    time: "18:00",
    location: "Online",
    participants: 128,
    maxParticipants: 256,
    prize: "$10,000",
    category: "Tournament",
    game: "CS2",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Valorant Community Night",
    description: "Casual gaming night for Valorant players. All skill levels welcome!",
    date: "2024-11-28",
    time: "20:00",
    location: "Online",
    participants: 45,
    maxParticipants: 100,
    prize: "Community Points",
    category: "Community",
    game: "Valorant",
    status: "upcoming"
  },
  {
    id: 3,
    title: "League of Legends Pro Scrims",
    description: "Professional scrimmage sessions for LoL teams. High-level gameplay only.",
    date: "2024-12-01",
    time: "19:00",
    location: "Online",
    participants: 10,
    maxParticipants: 10,
    prize: "Experience",
    category: "Scrims",
    game: "LoL",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Fortnite Battle Royale",
    description: "Epic Fortnite battle royale with custom rules and special rewards.",
    date: "2024-11-25",
    time: "21:00",
    location: "Online",
    participants: 89,
    maxParticipants: 100,
    prize: "$500",
    category: "Tournament",
    game: "Fortnite",
    status: "upcoming"
  },
  {
    id: 5,
    title: "Minecraft Build Competition",
    description: "Show off your building skills in our creative Minecraft competition!",
    date: "2024-12-10",
    time: "16:00",
    location: "Online",
    participants: 23,
    maxParticipants: 50,
    prize: "Gaming Gear",
    category: "Creative",
    game: "Minecraft",
    status: "upcoming"
  },
  {
    id: 6,
    title: "Rocket League Championship",
    description: "High-octane Rocket League tournament with amazing prizes!",
    date: "2024-12-20",
    time: "17:00",
    location: "Online",
    participants: 64,
    maxParticipants: 128,
    prize: "$2,000",
    category: "Tournament",
    game: "Rocket League",
    status: "upcoming"
  }
]

const categories = ["All", "Tournament", "Community", "Scrims", "Creative", "Workshop"]

export default function EventsPage() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Gaming Events
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join tournaments, community events, and gaming competitions. 
              Connect with players and win amazing prizes!
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
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
                Create Event
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

      {/* Events Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="gaming-card border-0 bg-gradient-to-br from-green-600/10 to-green-800/10 hover:from-green-600/20 hover:to-green-800/20 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-green-600/50 text-green-200">
                      {event.category}
                    </Badge>
                    <Badge className="bg-green-600/50 text-green-200">
                      {event.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-xl mb-2">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Event Details */}
                    <div className="flex items-center text-gray-300 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{event.participants}/{event.maxParticipants} participants</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>Prize: {event.prize}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                      ></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 gaming-button text-sm">
                        Join Event
                      </Button>
                      <Button className="bg-green-600/20 backdrop-blur-sm border border-green-500/30 text-white hover:bg-green-600/30 text-sm">
                        Details
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
              Load More Events
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="py-16 bg-gradient-to-r from-green-600/20 to-green-800/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Event
            </h2>
            <p className="text-xl text-gray-300">
              Don't miss our biggest tournament of the year!
            </p>
          </div>

          <Card className="gaming-card border-0 bg-gradient-to-br from-green-600/20 to-green-800/20 max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-yellow-400 mr-2" />
                <Badge className="bg-yellow-600/50 text-yellow-200">
                  Featured
                </Badge>
              </div>
              <CardTitle className="text-white text-3xl mb-4">
                GamingWithYou Championship 2024
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                The ultimate gaming championship featuring multiple games, 
                massive prize pools, and the best players from around the world.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">$50,000</div>
                  <div className="text-gray-400">Total Prize Pool</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">1,000+</div>
                  <div className="text-gray-400">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">10</div>
                  <div className="text-gray-400">Games</div>
                </div>
              </div>
              <Button className="gaming-button text-lg px-8 py-4">
                <Gamepad2 className="mr-3 h-6 w-6" />
                Register Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
} 