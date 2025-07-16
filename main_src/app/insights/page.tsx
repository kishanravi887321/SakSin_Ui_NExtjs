"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Share,
  MoreVertical,
  Target,
  Clock,
  Award,
  Users,
  Brain,
  Zap,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState } from "react"

const performanceData = [
  { month: "Jan", score: 72, sessions: 8 },
  { month: "Feb", score: 78, sessions: 12 },
  { month: "Mar", score: 85, sessions: 15 },
  { month: "Apr", score: 82, sessions: 18 },
  { month: "May", score: 88, sessions: 22 },
  { month: "Jun", score: 86, sessions: 24 },
]

const skillBreakdown = [
  { skill: "Technical Skills", current: 85, previous: 78, trend: "up" },
  { skill: "Communication", current: 92, previous: 88, trend: "up" },
  { skill: "Problem Solving", current: 78, previous: 82, trend: "down" },
  { skill: "Leadership", current: 88, previous: 85, trend: "up" },
  { skill: "System Design", current: 75, previous: 70, trend: "up" },
  { skill: "Behavioral", current: 90, previous: 87, trend: "up" },
]

const companyInsights = [
  { company: "Google", sessions: 8, avgScore: 85, difficulty: "High", color: "from-blue-500 to-cyan-500" },
  { company: "Meta", sessions: 6, avgScore: 78, difficulty: "High", color: "from-purple-500 to-pink-500" },
  { company: "Amazon", sessions: 5, avgScore: 92, difficulty: "Medium", color: "from-orange-500 to-red-500" },
  { company: "Apple", sessions: 4, avgScore: 88, difficulty: "High", color: "from-gray-500 to-slate-500" },
  { company: "Netflix", sessions: 3, avgScore: 82, difficulty: "Medium", color: "from-red-500 to-pink-500" },
]

const insights = [
  {
    id: 1,
    type: "strength",
    title: "Communication Excellence",
    description: "Your communication skills have improved by 15% this month. Keep practicing active listening.",
    icon: "🗣️",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 2,
    type: "improvement",
    title: "System Design Focus",
    description: "Consider spending more time on system design concepts. Your scores are 10% below average.",
    icon: "⚙️",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 3,
    type: "achievement",
    title: "Consistency Streak",
    description: "You've maintained a 7-day practice streak! This consistency is paying off.",
    icon: "🔥",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 4,
    type: "recommendation",
    title: "Mock Interview Ready",
    description: "Based on your progress, you're ready for advanced mock interviews with senior engineers.",
    icon: "🎯",
    color: "from-blue-500 to-cyan-500",
  },
]

const weeklyActivity = [
  { day: "Mon", sessions: 2, score: 85 },
  { day: "Tue", sessions: 1, score: 78 },
  { day: "Wed", sessions: 3, score: 92 },
  { day: "Thu", sessions: 2, score: 88 },
  { day: "Fri", sessions: 1, score: 82 },
  { day: "Sat", sessions: 0, score: 0 },
  { day: "Sun", sessions: 2, score: 90 },
]

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Performance Insights</h1>
            <p className="text-slate-300 text-lg">Deep dive into your interview performance and growth patterns</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-600/50 text-slate-300 bg-transparent rounded-xl">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 30 days
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  Last 30 days
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  Last 3 months
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  Last year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="border-slate-600/50 text-slate-300 bg-transparent rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border-emerald-500/30 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-400 text-sm font-medium">Average Score</p>
                  <p className="text-3xl font-bold text-white mt-1">86%</p>
                  <p className="text-emerald-400 text-sm flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +5% from last month
                  </p>
                </div>
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border-blue-500/30 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Total Sessions</p>
                  <p className="text-3xl font-bold text-white mt-1">24</p>
                  <p className="text-blue-400 text-sm flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12 this month
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border-purple-500/30 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Practice Time</p>
                  <p className="text-3xl font-bold text-white mt-1">18h</p>
                  <p className="text-purple-400 text-sm flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8h this month
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border-orange-500/30 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">94%</p>
                  <p className="text-orange-400 text-sm flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +2% improvement
                  </p>
                </div>
                <Award className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Trend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">Performance Trend</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                          <Share className="w-4 h-4 mr-2" />
                          Share Chart
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceData.map((data, index) => (
                      <motion.div
                        key={data.month}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {data.month}
                          </div>
                          <div>
                            <p className="text-white font-semibold">Score: {data.score}%</p>
                            <p className="text-slate-400 text-sm">{data.sessions} sessions</p>
                          </div>
                        </div>
                        <div className="w-32">
                          <Progress value={data.score} className="h-2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-emerald-400" />
                    Skills Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {skillBreakdown.map((skill, index) => (
                    <motion.div
                      key={skill.skill}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{skill.skill}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 text-sm">{skill.previous}%</span>
                          {skill.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span
                            className={`font-semibold ${skill.trend === "up" ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {skill.current}%
                          </span>
                        </div>
                      </div>
                      <Progress value={skill.current} className="h-2" />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Company Performance */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <Users className="w-6 h-6 mr-2 text-emerald-400" />
                    Company Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {companyInsights.map((company, index) => (
                      <motion.div
                        key={company.company}
                        className={`p-4 rounded-xl bg-gradient-to-br ${company.color}/20 border border-current/20`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold">{company.company}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              company.difficulty === "High"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {company.difficulty}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Sessions</span>
                            <span className="text-white font-semibold">{company.sessions}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Avg Score</span>
                            <span className="text-emerald-400 font-semibold">{company.avgScore}%</span>
                          </div>
                          <Progress value={company.avgScore} className="h-2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border-emerald-500/30 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-emerald-400" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={insight.id}
                      className={`p-4 rounded-xl bg-gradient-to-br ${insight.color}/20 border border-current/20`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{insight.icon}</span>
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-1">{insight.title}</h4>
                          <p className="text-slate-300 text-xs leading-relaxed">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weeklyActivity.map((day, index) => (
                      <motion.div
                        key={day.day}
                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {day.day.charAt(0)}
                          </div>
                          <span className="text-slate-300 text-sm">{day.day}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-sm font-semibold">{day.sessions} sessions</p>
                          {day.score > 0 && <p className="text-emerald-400 text-xs">{day.score}% avg</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Focus on Weak Areas
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl justify-start"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Detailed Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl justify-start"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share Progress
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
