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
  Crown,
  Shield,
  Zap,
  Heart,
  MessageCircle
} from "lucide-react"
import Link from "next/link"

// Empty services array - will be populated from API
const services: any[] = []

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
           {services.length > 0 ? (
             <>
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
             </>
           ) : (
             <div className="text-center py-16">
               <div className="w-24 h-24 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <MessageCircle className="h-12 w-12 text-green-400" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-4">No Services Available</h3>
               <p className="text-gray-400 text-lg max-w-md mx-auto">
                 There are currently no services available. Check back later for new gaming services!
               </p>
             </div>
           )}
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


    </div>
  )
} 