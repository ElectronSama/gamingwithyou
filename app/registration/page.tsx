"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  CheckCircle,
  Gamepad2,
  Sparkles,
  Shield,
  Trophy,
  Users,
  Star,
  Zap
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegistrationPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Registration successful, redirect to login
      router.push("/login?message=Registration successful! Please sign in.")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isPasswordValid = formData.password.length >= 8
  const doPasswordsMatch = formData.password === formData.confirmPassword

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
            Join the Ultimate
            <span className="block bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              Gaming Community
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-md">
            Ready to level up? Create your account and start your gaming journey with thousands of players!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 w-full max-w-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-gray-400 text-sm">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-gray-400 text-sm">Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">$1M+</div>
              <div className="text-gray-400 text-sm">Prize Pool</div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span>Instant matchmaking</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Trophy className="h-5 w-5 text-green-400" />
              <span>Compete in tournaments</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Users className="h-5 w-5 text-green-400" />
              <span>Build your team</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Star className="h-5 w-5 text-green-400" />
              <span>Earn rewards & badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md gaming-card border-0 bg-gradient-to-br from-green-600/10 to-green-800/10 backdrop-blur-sm">
          <CardHeader className="text-center">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Join the Gaming Community!</span>
              <Sparkles className="h-5 w-5 text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Ready to level up? Let's get you started on your gaming journey!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-white flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Choose your gaming username"
                  className="w-full px-4 py-3 bg-white/10 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-300"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a strong password"
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
                {formData.password && (
                  <div className="flex items-center gap-2 text-sm">
                    {isPasswordValid ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Shield className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className={isPasswordValid ? "text-green-400" : "text-yellow-400"}>
                      {isPasswordValid ? "Strong password!" : "Password must be at least 8 characters"}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 bg-white/10 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-300 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-sm">
                    {doPasswordsMatch ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Shield className="h-4 w-4 text-red-400" />
                    )}
                    <span className={doPasswordsMatch ? "text-green-400" : "text-red-400"}>
                      {doPasswordsMatch ? "Passwords match!" : "Passwords don't match"}
                    </span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  I agree to the{" "}
                  <Link href="/terms-and-conditions" className="text-green-400 hover:text-green-300 underline transition-colors">
                    Terms and Conditions
                  </Link>
                  {" "}and{" "}
                  <Link href="/privacy-policy" className="text-green-400 hover:text-green-300 underline transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full gaming-button text-lg py-3"
                disabled={!agreedToTerms || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>



              {/* Sign In Link */}
              <div className="text-center text-gray-300">
                <span>Already have an account? </span>
                <Link 
                  href="/login" 
                  className="text-green-400 hover:text-green-300 underline font-medium transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 