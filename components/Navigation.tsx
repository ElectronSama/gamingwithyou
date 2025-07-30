"use client"

import { Button } from "@/components/ui/button"
import { 
  Gamepad2, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  User,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"

export default function Navigation() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-purple-900/20 backdrop-blur-sm border-b border-purple-500/30' 
        : 'bg-purple-900 border-b border-purple-700'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-purple-300" />
            <span className="text-xl font-bold text-white">GamingWithYou</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/games" className="text-purple-200 hover:text-white transition-colors">
              Games
            </Link>
            <Link href="/gamers" className="text-purple-200 hover:text-white transition-colors">
              Gamers
            </Link>
            <Link href="/events" className="text-purple-200 hover:text-white transition-colors">
              Events
            </Link>
            <Link href="/services" className="text-purple-200 hover:text-white transition-colors">
              Services
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-purple-200">Welcome, {session.user?.username || session.user?.email}</span>
                <Button asChild className="bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 text-white hover:bg-purple-600/30 hover:border-purple-400/50 transition-all duration-300">
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 text-white hover:bg-red-600/30 hover:border-red-400/50 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button asChild className="bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 text-white hover:bg-purple-600/30 hover:border-purple-400/50 transition-all duration-300">
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="gaming-button">
                  <Link href="/registration">
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-purple-200 p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-700">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/games" 
                className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Gamepad2 className="h-5 w-5" />
                <span>Games</span>
              </Link>
              <Link 
                href="/gamers" 
                className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                <span>Gamers</span>
              </Link>
              <Link 
                href="/events" 
                className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="h-5 w-5" />
                <span>Events</span>
              </Link>
              <Link 
                href="/services" 
                className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Services</span>
              </Link>
              
              <div className="pt-4 border-t border-purple-700">
                {session ? (
                  <div className="flex flex-col space-y-2">
                                         <span className="text-purple-200 text-sm">Welcome, {session.user?.username || session.user?.email}</span>
                    <Button asChild className="bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 text-white hover:bg-purple-600/30 hover:border-purple-400/50 transition-all duration-300">
                      <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    <Button 
                      onClick={() => {
                        signOut({ callbackUrl: "/" })
                        setIsMenuOpen(false)
                      }}
                      className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 text-white hover:bg-red-600/30 hover:border-red-400/50 transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button asChild className="bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 text-white hover:bg-purple-600/30 hover:border-purple-400/50 transition-all duration-300">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="gaming-button">
                      <Link href="/registration" onClick={() => setIsMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 