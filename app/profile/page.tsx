"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar, Shield } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <Card className="w-full max-w-md gaming-card border-0 bg-gradient-to-br from-purple-600/10 to-purple-800/10 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Profile
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Welcome to your gaming profile!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <User className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Username:</span>
              <span>{(session.user as any)?.username || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Mail className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Email:</span>
              <span>{session.user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Calendar className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Member since:</span>
              <span>Recently</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Shield className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Role:</span>
              <span>{(session.user as any)?.isAdmin ? "Admin" : "User"}</span>
            </div>
          </div>
          
          <Button 
            onClick={() => router.push("/")}
            className="w-full gaming-button"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 