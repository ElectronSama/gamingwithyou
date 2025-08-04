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
  X,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navigation() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile()
    }
  }, [session])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/20 backdrop-blur-sm border-b border-green-500/30' 
        : 'bg-black border-b border-green-700'
    }`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Logo - col - balra igazítva */}
          <div className="col-span-1 flex items-center justify-start">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo/logo.png" 
                alt="GamingWithYou Logo" 
                width={32} 
                height={32} 
                className="h-8 w-auto"
                priority
              />
              <span className="text-xl font-bold text-white">GamingWithYou</span>
            </Link>
          </div>

          {/* Mobile Navigation - col - középre igazítva */}
          <div className="col-span-1 md:hidden flex items-center justify-center">
            {/* Üres - mobil menüben nincs tartalom */}
          </div>

          {/* Desktop Navigation - col - középre igazítva */}
          <div className="col-span-1 hidden md:flex items-center justify-center">
            <div className="flex items-center space-x-8">
              <Link href="/games" className="text-green-200 hover:text-white transition-colors">
                Games
              </Link>
              <Link href="/gamers" className="text-green-200 hover:text-white transition-colors">
                Gamers
              </Link>
              <Link href="/support" className="text-green-200 hover:text-white transition-colors">
                Support
              </Link>
              <Link href="/services" className="text-green-200 hover:text-white transition-colors">
                Services
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons - col - jobbra igazítva */}
          <div className="col-span-1 hidden md:flex items-center justify-end space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto bg-transparent border-none hover:bg-transparent">
                      <div className="p-1 rounded-full hover:bg-emerald-600/20 transition-colors">
                        {userProfile?.avatar ? (
                          <img 
                            src={userProfile.avatar} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400/50 hover:border-emerald-300/70 transition-colors"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center border-2 border-emerald-400/50 hover:border-emerald-300/70 transition-colors">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/50 text-white rounded-lg shadow-xl" sideOffset={0} align="end">
                    <DropdownMenuItem asChild className="hover:bg-emerald-600/30 focus:bg-emerald-600/30 rounded-md mx-1 my-0.5">
                      <Link href="/profile" className="flex items-center space-x-2 cursor-pointer py-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-emerald-600/30 focus:bg-emerald-600/30 rounded-md mx-1 my-0.5">
                      <Link href="/profile" className="flex items-center space-x-2 cursor-pointer py-2">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-emerald-600/30 focus:bg-emerald-600/30 rounded-md mx-1 my-0.5">
                      <Link href="/profile/services/dashboard" className="flex items-center space-x-2 cursor-pointer py-2">
                        <Gamepad2 className="h-4 w-4" />
                        <span>Services</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-emerald-400/50 mx-1" />
                    <DropdownMenuItem 
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center space-x-2 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-600/20 focus:bg-red-600/20 rounded-md mx-1 my-0.5 py-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button asChild className="bg-green-600/20 backdrop-blur-sm border border-green-500/30 text-white hover:bg-green-600/30 hover:border-green-400/50 transition-all duration-300">
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
          <div className="col-span-1 md:hidden flex items-center justify-end">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-green-200 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-700">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/games" 
                className="text-green-200 hover:text-white transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Gamepad2 className="h-5 w-5" />
                <span>Games</span>
              </Link>
              <Link 
                href="/gamers" 
                className="text-green-200 hover:text-white transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                <span>Gamers</span>
              </Link>
              <Link 
                href="/support" 
                className="text-green-200 hover:text-white transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Support</span>
              </Link>
              <Link 
                href="/services" 
                className="text-green-200 hover:text-white transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Gamepad2 className="h-5 w-5" />
                <span>Services</span>
              </Link>
              
              <div className="pt-4 border-t border-green-700">
                {session ? (
                  <div className="flex flex-col space-y-2">
                    {/* Mobile Profile Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 h-auto bg-transparent border-none hover:bg-transparent w-full justify-start">
                          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg w-full hover:bg-green-600/20 transition-colors">
                            {userProfile?.avatar ? (
                              <img 
                                src={userProfile.avatar} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full object-cover border-2 border-green-500/30"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center border-2 border-green-500/30">
                                <User className="h-5 w-5 text-white" />
                              </div>
                            )}
                            <div className="flex-1 text-left">
                              <p className="text-white font-medium text-sm">
                                {session.user?.username || session.user?.email}
                              </p>
                              <p className="text-gray-400 text-xs">Tap to open menu</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-green-400" />
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/50 text-white rounded-lg shadow-xl" side="bottom" align="start" sideOffset={0}>
                        <DropdownMenuItem asChild className="hover:bg-emerald-600/30 focus:bg-emerald-600/30 rounded-md mx-1 my-0.5">
                          <Link href="/profile" className="flex items-center space-x-2 cursor-pointer py-2" onClick={() => setIsMenuOpen(false)}>
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="hover:bg-emerald-600/30 focus:bg-emerald-600/30 rounded-md mx-1 my-0.5">
                          <Link href="/profile" className="flex items-center space-x-2 cursor-pointer py-2" onClick={() => setIsMenuOpen(false)}>
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="hover:bg-emerald-600/30 focus:bg-emerald-600/30 rounded-md mx-1 my-0.5">
                          <Link href="/services" className="flex items-center space-x-2 cursor-pointer py-2" onClick={() => setIsMenuOpen(false)}>
                            <Gamepad2 className="h-4 w-4" />
                            <span>Services</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-emerald-400/50 mx-1" />
                        <DropdownMenuItem 
                          onClick={() => {
                            signOut({ callbackUrl: "/" })
                            setIsMenuOpen(false)
                          }}
                          className="flex items-center space-x-2 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-600/20 focus:bg-red-600/20 rounded-md mx-1 my-0.5 py-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button asChild className="bg-green-600/20 backdrop-blur-sm border border-green-500/30 text-white hover:bg-green-600/30 hover:border-green-400/50 transition-all duration-300">
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