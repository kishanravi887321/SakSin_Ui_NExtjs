"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Mail,
  MapPin,
  Calendar,
  Award,
  Target,
  TrendingUp,
  Settings,
  Edit,
  Share,
  Download,
  MoreVertical,
  Star,
  Trophy,
  Clock,
  BarChart3,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState } from "react"

const achievements = [
  {
    id: 1,
    title: "First Interview",
    description: "Completed your first practice session",
    icon: "🎯",
    date: "2024-01-10",
    earned: true,
  },
  {
    id: 2,
    title: "Perfect Score",
    description: "Achieved 100% in an interview session",
    icon: "🏆",
    date: "2024-01-15",
    earned: true,
  },
  {
    id: 3,
    title: "Consistency King",
    description: "Practiced for 7 consecutive days",
    icon: "🔥",
    date: "2024-01-18",
    earned: true,
  },
  {
    id: 4,
    title: "Tech Master",
    description: "Completed 10 technical interviews",
    icon: "💻",
    date: null,
    earned: false,
  },
  {
    id: 5,
    title: "Communication Pro",
    description: "Scored 95%+ in communication skills",
    icon: "🗣️",
    date: "2024-01-20",
    earned: true,
  },
  {
    id: 6,
    title: "Marathon Runner",
    description: "Completed 50 practice sessions",
    icon: "🏃",
    date: null,
    earned: false,
  },
]

const skillsData = [
  { name: "Technical Skills", score: 85, color: "bg-blue-500" },
  { name: "Communication", score: 92, color: "bg-emerald-500" },
  { name: "Problem Solving", score: 78, color: "bg-purple-500" },
  { name: "Leadership", score: 88, color: "bg-orange-500" },
  { name: "System Design", score: 75, color: "bg-pink-500" },
  { name: "Behavioral", score: 90, color: "bg-cyan-500" },
]

const recentActivity = [
  {
    id: 1,
    type: "interview",
    title: "Completed Software Engineer interview",
    company: "Google",
    score: 85,
    date: "2024-01-15",
    icon: "💻",
  },
  {
    id: 2,
    type: "achievement",
    title: "Earned Communication Pro badge",
    description: "Scored 95%+ in communication skills",
    date: "2024-01-14",
    icon: "🏆",
  },
  {
    id: 3,
    type: "interview",
    title: "Completed Product Manager interview",
    company: "Meta",
    score: 78,
    date: "2024-01-13",
    icon: "📱",
  },
  {
    id: 4,
    type: "milestone",
    title: "Reached 20 practice sessions",
    description: "Keep up the great work!",
    date: "2024-01-12",
    icon: "🎯",
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />

      <div className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center space-x-6 mb-6 md:mb-0">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-blue-500 text-white text-2xl">
                        AK
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Star className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Alex Kumar</h1>
                    <p className="text-slate-300 text-lg mb-3">Senior Software Engineer</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        alex@example.com
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        San Francisco, CA
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Joined Jan 2024
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                        <Share className="w-4 h-4 mr-2" />
                        Share Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                        <Settings className="w-4 h-4 mr-2" />
                        Privacy Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border-emerald-500/30 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">24</p>
              <p className="text-emerald-400 text-sm">Total Sessions</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border-blue-500/30 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">86%</p>
              <p className="text-blue-400 text-sm">Avg Score</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border-purple-500/30 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">18h</p>
              <p className="text-purple-400 text-sm">Practice Time</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border-orange-500/30 rounded-2xl">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">4</p>
              <p className="text-orange-400 text-sm">Achievements</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1">
            {["overview", "skills", "achievements", "activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Skills Overview */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-emerald-400" />
                      Skills Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skillsData.slice(0, 4).map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300 font-medium">{skill.name}</span>
                          <span className="text-emerald-400 font-semibold">{skill.score}%</span>
                        </div>
                        <Progress value={skill.score} className="h-2" />
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.slice(0, 3).map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-lg">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{activity.title}</h4>
                          {activity.company && <p className="text-slate-400 text-sm">{activity.company}</p>}
                          {activity.description && <p className="text-slate-400 text-sm">{activity.description}</p>}
                        </div>
                        <div className="text-right">
                          {activity.score && <p className="text-emerald-400 font-semibold">{activity.score}%</p>}
                          <p className="text-slate-400 text-sm">{activity.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Skill Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {skillsData.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-700/30 rounded-xl"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-white font-semibold text-lg">{skill.name}</span>
                          <span className="text-emerald-400 font-bold text-xl">{skill.score}%</span>
                        </div>
                        <Progress value={skill.score} className="h-3 mb-2" />
                        <div className="flex justify-between text-sm text-slate-400">
                          <span>Beginner</span>
                          <span>Expert</span>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "achievements" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-emerald-400" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            achievement.earned
                              ? "bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-500/30"
                              : "bg-slate-700/30 border-slate-600/30 opacity-60"
                          }`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: achievement.earned ? 1.02 : 1 }}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{achievement.icon}</span>
                            <div>
                              <h4 className={`font-semibold ${achievement.earned ? "text-white" : "text-slate-400"}`}>
                                {achievement.title}
                              </h4>
                              {achievement.earned && achievement.date && (
                                <p className="text-emerald-400 text-sm">{achievement.date}</p>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm ${achievement.earned ? "text-slate-300" : "text-slate-500"}`}>
                            {achievement.description}
                          </p>
                          {!achievement.earned && (
                            <Badge variant="outline" className="mt-2 border-slate-500 text-slate-400">
                              Locked
                            </Badge>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">{activity.title}</h4>
                          {activity.company && <p className="text-slate-300 text-sm mb-1">{activity.company}</p>}
                          {activity.description && (
                            <p className="text-slate-400 text-sm mb-2">{activity.description}</p>
                          )}
                          <p className="text-slate-500 text-xs">{activity.date}</p>
                        </div>
                        {activity.score && (
                          <div className="text-right">
                            <p className="text-emerald-400 font-bold text-lg">{activity.score}%</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border-emerald-500/30 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                    Monthly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-white">86%</p>
                    <p className="text-emerald-400">Overall Score</p>
                  </div>
                  <Progress value={86} className="h-3 mb-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Sessions this month</span>
                      <span className="text-white font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Improvement</span>
                      <span className="text-emerald-400 font-semibold">+8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Start New Practice
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl justify-start"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl justify-start"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recent Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {achievements
                      .filter((a) => a.earned)
                      .slice(0, 4)
                      .map((achievement) => (
                        <motion.div
                          key={achievement.id}
                          className="text-center p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl border border-emerald-500/30"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="text-2xl mb-1">{achievement.icon}</div>
                          <p className="text-white text-xs font-medium">{achievement.title}</p>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
