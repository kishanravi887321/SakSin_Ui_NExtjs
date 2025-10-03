"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sparkles, Bell, Settings, User, LogOut, Search, Menu } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useUser } from "@/hooks/use-user"
import { normalizeUserData, getDisplayName, getUserInitials, getProfileImage, UnifiedUserProfile } from "../lib/user-utils"

export function DashboardHeader() {
  const [notifications] = useState(3)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { logout, accessToken } = useAuth()
  const { user, isLoading: userLoading } = useUser()
  const [fallbackUser, setFallbackUser] = useState(null)

  // Fallback: Try to get user data directly if useUser hook fails
  useEffect(() => {
    const fetchUserFallback = async () => {
      if (!user && !userLoading && accessToken) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })
          if (response.ok) {
            const userData = await response.json()
            console.log('Fallback user data fetched:', userData)
            setFallbackUser(userData)
          }
        } catch (error) {
          console.error('Fallback user fetch failed:', error)
        }
      }
    }
    
    fetchUserFallback()
  }, [user, accessToken, userLoading])

  // Use either the hook user or fallback user, normalized
  const currentUser: UnifiedUserProfile = normalizeUserData(user || fallbackUser)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Get display values using utility functions
  const displayName = getDisplayName(currentUser) || "User"
  const displayEmail = currentUser.email || ""
  const profileImage = getProfileImage(currentUser)
  const userInitials = getUserInitials(currentUser)

  // Add debugging
  console.log('Dashboard Header (main_src) - User data:', { 
    user, 
    fallbackUser, 
    currentUser, 
    displayName, 
    displayEmail,
    userLoading,
    accessToken: !!accessToken 
  })

  return (
    <motion.header
      className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-700/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
              <Sparkles className="w-8 h-8 text-emerald-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                SakSin AI
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/roles" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
              Practice
            </Link>
            <Link href="/insights" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
              Insights
            </Link>
            <Link href="/profile" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
              Profile
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-slate-800/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64"
              />
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative text-slate-300 hover:text-white">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {notifications}
                    </motion.span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-slate-700">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <DropdownMenuItem className="p-4 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                    <div>
                      <p className="font-medium">New interview feedback available</p>
                      <p className="text-sm text-slate-400">Your Google SDE interview analysis is ready</p>
                      <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-4 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                    <div>
                      <p className="font-medium">Upcoming interview reminder</p>
                      <p className="text-sm text-slate-400">Netflix Technical Lead session in 2 days</p>
                      <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-4 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                    <div>
                      <p className="font-medium">Achievement unlocked!</p>
                      <p className="text-sm text-slate-400">You've completed 25 practice sessions</p>
                      <p className="text-xs text-slate-500 mt-1">3 days ago</p>
                    </div>
                  </DropdownMenuItem>
                </div>
                <div className="p-4 border-t border-slate-700">
                  <Button variant="outline" className="w-full border-slate-600/50 text-slate-300 bg-transparent">
                    View All Notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={profileImage} 
                      alt="Profile" 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-blue-500 text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                <div className="p-4 border-b border-slate-700">
                  <p className="text-white font-medium">{displayName}</p>
                  <p className="text-slate-400 text-sm">{displayEmail}</p>
                </div>
                <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  className="text-red-400 hover:text-red-300 hover:bg-slate-700 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 pb-4 border-t border-slate-700/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="flex flex-col space-y-4 pt-4">
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/roles"
                className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Practice
              </Link>
              <Link
                href="/insights"
                className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Insights
              </Link>
              <Link
                href="/profile"
                className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            </nav>

            {/* Mobile Profile Section */}
            <div className="pt-4 mt-4 border-t border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={profileImage} 
                    alt="Profile" 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-blue-500 text-white text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-medium">{displayName}</p>
                  <p className="text-slate-400 text-xs">{displayEmail}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-slate-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
