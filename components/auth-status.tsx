"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, User, LogOut, Settings, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function AuthStatus() {
  const { isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl shadow-2xl">
              <CardHeader className="text-center pb-8">
                <motion.div className="flex items-center justify-center space-x-3 mb-6" whileHover={{ scale: 1.05 }}>
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    SakSin AI
                  </span>
                </motion.div>
                <CardTitle className="text-2xl font-bold text-white mb-2">Welcome Back!</CardTitle>
                <p className="text-slate-400">You are successfully logged in</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <User className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">Authenticated User</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Link href="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl h-12">
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  
                  <Link href="/profile">
                    <Button variant="outline" className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl h-12">
                      <Settings className="w-5 h-5 mr-2" />
                      Profile Settings
                    </Button>
                  </Link>

                  <Button 
                    onClick={logout}
                    variant="outline" 
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent rounded-xl h-12"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Not authenticated - show login required
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl shadow-2xl">
            <CardHeader className="text-center pb-8">
              <motion.div className="flex items-center justify-center space-x-3 mb-6" whileHover={{ scale: 1.05 }}>
                <Sparkles className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  SakSin AI
                </span>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white mb-2">Login Required</CardTitle>
              <p className="text-slate-400">Please sign in to access your account</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <User className="w-5 h-5 text-red-400" />
                <span className="text-red-300 font-medium">Not Authenticated</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl h-12">
                    Sign In
                  </Button>
                </Link>
                
                <Link href="/signup">
                  <Button variant="outline" className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl h-12">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
