"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Award,
  Play,
  BookOpen,
  Settings,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SubscriptionStatus } from "@/components/subscription-status"

const recentSessions = [
  {
    id: 1,
    role: "Software Engineer",
    company: "Google",
    date: "2024-01-15",
    score: 85,
    duration: "45 min",
    status: "completed",
    emoji: "💻",
  },
  {
    id: 2,
    role: "Product Manager",
    company: "Meta",
    date: "2024-01-14",
    score: 78,
    duration: "38 min",
    status: "completed",
    emoji: "📱",
  },
  {
    id: 3,
    role: "Data Analyst",
    company: "Amazon",
    date: "2024-01-13",
    score: 92,
    duration: "42 min",
    status: "completed",
    emoji: "📊",
  },
  {
    id: 4,
    role: "UX Designer",
    company: "Apple",
    date: "2024-01-12",
    score: 88,
    duration: "35 min",
    status: "completed",
    emoji: "🎨",
  },
]

const upcomingSessions = [
  {
    id: 1,
    role: "Senior Software Engineer",
    company: "Netflix",
    date: "2024-01-20",
    time: "2:00 PM",
    type: "System Design",
    emoji: "⚙️",
  },
  {
    id: 2,
    role: "Technical Lead",
    company: "Spotify",
    date: "2024-01-22",
    time: "10:00 AM",
    type: "Leadership",
    emoji: "👥",
  },
]

const quickStats = [
  {
    title: "Total Sessions",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: BarChart3,
    color: "text-emerald-400",
  },
  {
    title: "Average Score",
    value: "86",
    change: "+5%",
    trend: "up",
    icon: Target,
    color: "text-blue-400",
  },
  {
    title: "Time Practiced",
    value: "18h",
    change: "+8h",
    trend: "up",
    icon: Clock,
    color: "text-purple-400",
  },
  {
    title: "Success Rate",
    value: "94%",
    change: "+2%",
    trend: "up",
    icon: Award,
    color: "text-orange-400",
  },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Alex! 👋</h1>
              <p className="text-slate-300 text-lg">Ready to ace your next interview? Let's continue your journey.</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl">
                <Play className="w-4 h-4 mr-2" />
                Start Practice
              </Button>
              <Button variant="outline" className="border-slate-500/50 text-slate-300 bg-transparent rounded-xl">
                <BookOpen className="w-4 h-4 mr-2" />
                Study Guide
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {quickStats.map((stat, index) => (
            <motion.div key={stat.title} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">Recent Practice Sessions</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search sessions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-600/50 text-slate-300 bg-transparent">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center text-xl">
                          {session.emoji}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{session.role}</h4>
                          <p className="text-slate-400 text-sm">
                            {session.company} • {session.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-emerald-400 font-semibold">{session.score}/100</p>
                          <p className="text-slate-400 text-sm">{session.duration}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                              Retake Session
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                              Share Results
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                  >
                    View All Sessions
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-emerald-400" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      className="p-4 bg-slate-700/30 rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{session.emoji}</span>
                        <div>
                          <h4 className="text-white font-semibold text-sm">{session.role}</h4>
                          <p className="text-slate-400 text-xs">{session.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{session.date}</span>
                        <span className="text-emerald-400">{session.time}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                          {session.type}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl">
                    Schedule New Session
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border-emerald-500/30 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Interview Skills</span>
                        <span className="text-emerald-400">86%</span>
                      </div>
                      <Progress value={86} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Technical Knowledge</span>
                        <span className="text-blue-400">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Communication</span>
                        <span className="text-purple-400">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 bg-transparent rounded-xl"
                  >
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/roles">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start New Interview
                    </Button>
                  </Link>
                  <Link href="/insights">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Insights
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SubscriptionStatus plan="free" usage={{ sessionsUsed: 3, sessionsLimit: 5, period: "this month" }} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
