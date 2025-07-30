import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Gamepad2, 
  Users, 
  Calendar, 
  Star, 
  TrendingUp,
  Play,
  Trophy,
  MessageCircle,
  ArrowRight,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        <div className="relative container mx-auto px-4 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#19FF00]/20 border border-[#19FF00]/30 rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-[#19FF00]" />
              <span className="text-[#19FF00] text-sm font-medium">Gaming Community Platform</span>
            </div>
            

            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Connect with
              <span className="block bg-gradient-to-r from-[#19FF00] to-[#00CC00] bg-clip-text text-transparent">
                Gamers Worldwide
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Find skilled players, book gaming sessions, and join an amazing community. 
              Your ultimate platform for gaming connections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="gaming-button text-lg px-8 py-4">
                <Link href="/games">
                  <Gamepad2 className="mr-3 h-6 w-6" />
                  Explore Games
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-[#19FF00]/20 backdrop-blur-sm border border-[#19FF00]/30 text-white hover:bg-[#19FF00]/30 hover:border-[#19FF00]/50 text-lg px-8 py-4 transition-all duration-300">
                <Link href="/gamers">
                  <Users className="mr-3 h-6 w-6" />
                  Find Gamers
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#19FF00] mb-2">10K+</div>
                <div className="text-gray-400">Active Gamers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2856F4] mb-2">500+</div>
                <div className="text-gray-400">Games Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#19FF00] mb-2">50K+</div>
                <div className="text-gray-400">Sessions Booked</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose GamingWithYou?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to connect, learn, and grow in the gaming community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="gaming-card border-0 bg-gradient-to-br from-[#19FF00]/10 to-[#00CC00]/10 hover:from-[#19FF00]/20 hover:to-[#00CC00]/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#19FF00] to-[#00CC00] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Book Gaming Sessions</CardTitle>
                <CardDescription className="text-gray-300">
                  Find skilled gamers and book personalized sessions for your favorite games. 
                  Learn from the best and improve your skills.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-[#2856F4]/10 to-[#1E40AF]/10 hover:from-[#2856F4]/20 hover:to-[#1E40AF]/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2856F4] to-[#1E40AF] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Connect with Gamers</CardTitle>
                <CardDescription className="text-gray-300">
                  Build your gaming network. Find players who share your interests 
                  and create lasting gaming friendships.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-[#19FF00]/10 to-[#00CC00]/10 hover:from-[#19FF00]/20 hover:to-[#00CC00]/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#19FF00] to-[#00CC00] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Join Events & Tournaments</CardTitle>
                <CardDescription className="text-gray-300">
                  Participate in gaming events, tournaments, and challenges. 
                  Compete with players worldwide and win prizes.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#19FF00] to-[#00CC00] rounded-full flex items-center justify-center mb-6 mx-auto text-black font-bold text-xl">
                1
              </div>
              <h3 className="text-white text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-gray-300">
                Sign up and create your gaming profile. Add your favorite games, skills, and availability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#19FF00] to-[#00CC00] rounded-full flex items-center justify-center mb-6 mx-auto text-black font-bold text-xl">
                2
              </div>
              <h3 className="text-white text-xl font-semibold mb-4">Find Players</h3>
              <p className="text-gray-300">
                Browse through our community of gamers. Filter by game, skill level, and availability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#19FF00] to-[#00CC00] rounded-full flex items-center justify-center mb-6 mx-auto text-black font-bold text-xl">
                3
              </div>
              <h3 className="text-white text-xl font-semibold mb-4">Start Gaming</h3>
              <p className="text-gray-300">
                Book sessions, join events, and start playing with your new gaming partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#19FF00]/20 to-[#00CC00]/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Gaming Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of gamers who are already connecting, learning, and having fun together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gaming-button text-lg px-8 py-4">
              <Link href="/registration">
                <Play className="mr-3 h-6 w-6" />
                Get Started Free
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-[#19FF00]/20 backdrop-blur-sm border border-[#19FF00]/30 text-white hover:bg-[#19FF00]/30 hover:border-[#19FF00]/50 text-lg px-8 py-4 transition-all duration-300">
              <Link href="/login">
                <MessageCircle className="mr-3 h-6 w-6" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
