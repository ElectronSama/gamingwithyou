"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Users,
  Star,
  TrendingUp,
  Calendar,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Gamepad2,
  Monitor
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: number
  gameId?: string
  gameName?: string
  platformId?: string
  platformName?: string
  isActive: boolean
  createdAt: string
  ordersCount: number
  totalEarnings: number
  averageRating: number
}

export default function ServicesDashboardPage() {
  const { data: session } = useSession()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalOrders: 0,
    totalEarnings: 0,
    averageRating: 0
  })

  useEffect(() => {
    if (session) {
      fetchServices()
      fetchStats()
    }
  }, [session])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services)
      } else {
        console.error('Failed to fetch services')
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/services/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('Failed to fetch stats')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const toggleServiceStatus = async (serviceId: string) => {
    try {
      const service = services.find(s => s.id === serviceId)
      if (!service) return
      
      const response = await fetch(`/api/user/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !service.isActive })
      })
      
      if (response.ok) {
        setServices(prev => prev.map(service => 
          service.id === serviceId 
            ? { ...service, isActive: !service.isActive }
            : service
        ))
        // Refresh stats after toggle
        fetchStats()
      } else {
        console.error('Failed to toggle service status')
      }
    } catch (error) {
      console.error('Error toggling service status:', error)
    }
  }

  const deleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      const response = await fetch(`/api/user/services/${serviceId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setServices(prev => prev.filter(service => service.id !== serviceId))
        // Refresh stats after deletion
        fetchStats()
      } else {
        console.error('Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Please sign in to access your services dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <section className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Services Dashboard
              </h1>
              <p className="text-xl text-gray-300">
                Manage your gaming services and track your performance
              </p>
            </div>
            <Button asChild className="gaming-button">
              <Link href="/profile/services/create">
                <Plus className="h-5 w-5 mr-2" />
                Create Service
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="gaming-card border-0 bg-gradient-to-br from-green-600/10 to-green-800/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Services</p>
                    <p className="text-2xl font-bold text-white">{stats.totalServices}</p>
                  </div>
                  <Settings className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-blue-600/10 to-blue-800/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Services</p>
                    <p className="text-2xl font-bold text-white">{stats.activeServices}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-yellow-600/10 to-yellow-800/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                  </div>
                  <Users className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-purple-600/10 to-purple-800/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold text-white">${stats.totalEarnings}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card border-0 bg-gradient-to-br from-pink-600/10 to-pink-800/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Rating</p>
                    <p className="text-2xl font-bold text-white">{stats.averageRating}</p>
                  </div>
                  <Star className="h-8 w-8 text-pink-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
              <span className="ml-3 text-white">Loading services...</span>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Services Yet</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
                Start offering your gaming services to the community and earn money!
              </p>
              <Button asChild className="gaming-button">
                <Link href="/profile/services/create">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Service
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {services.map((service) => (
                <Card key={service.id} className="gaming-card border-0 bg-gradient-to-br from-green-600/10 to-green-800/10 hover:from-green-600/20 hover:to-green-800/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-xl font-bold text-white">{service.title}</h3>
                          <Badge 
                            variant={service.isActive ? "default" : "secondary"}
                            className={service.isActive 
                              ? "bg-green-600/50 text-green-200" 
                              : "bg-gray-600/50 text-gray-300"
                            }
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{service.description}</p>
                        
                                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                           <div className="flex items-center gap-2">
                             <DollarSign className="h-4 w-4 text-green-400" />
                             <span className="text-white font-semibold">${service.price}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Clock className="h-4 w-4 text-blue-400" />
                             <span className="text-gray-300">{service.duration} min</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Users className="h-4 w-4 text-yellow-400" />
                             <span className="text-gray-300">{service.ordersCount} orders</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Star className="h-4 w-4 text-pink-400" />
                             <span className="text-gray-300">{service.averageRating} rating</span>
                           </div>
                         </div>
                         
                         {/* Game and Platform Info */}
                         {(service.gameName || service.platformName) && (
                           <div className="flex flex-wrap gap-2 mt-4">
                             {service.gameName && (
                               <Badge variant="outline" className="bg-green-600/20 border-green-500/30 text-green-300">
                                 <Gamepad2 className="h-3 w-3 mr-1" />
                                 {service.gameName}
                               </Badge>
                             )}
                             {service.platformName && (
                               <Badge variant="outline" className="bg-blue-600/20 border-blue-500/30 text-blue-300">
                                 <Monitor className="h-3 w-3 mr-1" />
                                 {service.platformName}
                               </Badge>
                             )}
                           </div>
                         )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleServiceStatus(service.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          {service.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-gray-400 hover:text-white"
                        >
                          <Link href={`/profile/services/${service.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteService(service.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 