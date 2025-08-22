// Test file to check if dashboard works without authentication
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, BookOpen } from "lucide-react"

export default function DashboardTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 sm:mb-6">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, Test User! 👋
              </h1>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg">Ready to ace your next interview? Let's continue your journey.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
              <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl text-sm sm:text-base">
                <Play className="w-4 h-4 mr-2" />
                Start Practice
              </Button>
              <Button variant="outline" className="border-slate-500/50 text-slate-300 bg-transparent rounded-xl text-sm sm:text-base">
                <BookOpen className="w-4 h-4 mr-2" />
                Study Guide
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Test Card */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Dashboard Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">If you can see this, the basic dashboard structure is working!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
