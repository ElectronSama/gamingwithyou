"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Gamepad2,
  Sparkles,
  Trophy,
  Users,
  Star
} from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const messageParam = searchParams.get("message")
    if (messageParam) {
      setMessage(messageParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        // Login successful, redirect to home page
        router.push("/")
      }
    } catch (error) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex">
      {/* Left Column - Gaming Content */}
              <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600/20 to-green-800/20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
                      <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center px-12">
          <div className="w-32 h-32 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <Gamepad2 className="h-16 w-16 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome Back to
            <span className="block bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              GamingWithYou
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-md">
            Ready to dominate? Let's get you back in the game and connect with fellow gamers!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 w-full max-w-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-gray-400 text-sm">Active Gamers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-400 text-sm">Games Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span>Join tournaments and win prizes</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Users className="h-5 w-5 text-blue-400" />
              <span>Connect with gamers worldwide</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Star className="h-5 w-5 text-green-400" />
              <span>Build your gaming reputation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md gaming-card border-0 bg-gradient-to-br from-green-600/10 to-green-800/10 backdrop-blur-sm">
          <CardHeader className="text-center">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
                          <Sparkles className="h-5 w-5 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Welcome Back, Gamer!</span>
            <Sparkles className="h-5 w-5 text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Ready to dominate? Let's get you back in the game!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-300"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-white/10 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-300 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-green-400 hover:text-green-300 underline transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full gaming-button text-lg py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-gray-300">
                <span>New to GamingWithYou? </span>
                <Link 
                  href="/registration" 
                  className="text-green-400 hover:text-green-300 underline font-medium transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 