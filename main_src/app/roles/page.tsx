"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Code, Users, BarChart3, Briefcase, Palette, Cog } from "lucide-react"
import Link from "next/link"

const roles = [
  {
    id: "sde",
    title: "Software Engineer",
    icon: Code,
    emoji: "💻",
    description: "Technical coding interviews, system design, and algorithmic problem solving",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    id: "pm",
    title: "Product Manager",
    icon: Users,
    emoji: "📱",
    description: "Product strategy, user experience, and stakeholder management",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    id: "analyst",
    title: "Data Analyst",
    icon: BarChart3,
    emoji: "📊",
    description: "Data interpretation, statistical analysis, and business insights",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    id: "consultant",
    title: "Business Consultant",
    icon: Briefcase,
    emoji: "💼",
    description: "Case studies, problem-solving frameworks, and client communication",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    id: "designer",
    title: "UX/UI Designer",
    icon: Palette,
    emoji: "🎨",
    description: "Design thinking, user research, and portfolio presentation",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    icon: Cog,
    emoji: "⚙️",
    description: "Infrastructure, automation, and system reliability",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
]

export default function RoleSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            animate={{
              x: [0, 200, 0],
              y: [0, -200, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">✨</span>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-12">
        {/* Title Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your Interview Role
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Select the role you're preparing for and get personalized AI-powered interview questions
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/interview/${role.id}`}>
                <Card
                  className={`${role.bgColor} backdrop-blur-sm ${role.borderColor} border-2 rounded-2xl hover:shadow-2xl transition-all duration-300 group cursor-pointer overflow-hidden relative`}
                >
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  <CardContent className="p-8 relative z-10">
                    {/* Icon and Emoji */}
                    <div className="flex items-center justify-between mb-6">
                      <motion.div
                        className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <role.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.span
                        className="text-4xl"
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 3,
                        }}
                      >
                        {role.emoji}
                      </motion.span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                      {role.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-300 mb-6 leading-relaxed">{role.description}</p>

                    {/* CTA Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className={`w-full bg-gradient-to-r ${role.color} hover:shadow-lg hover:shadow-current/25 text-white rounded-xl py-3 font-semibold transition-all duration-300`}
                      >
                        Start Interview
                      </Button>
                    </motion.div>
                  </CardContent>

                  {/* Hover Effect Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          x: [0, Math.random() * 100 - 50],
                          y: [0, Math.random() * 100 - 50],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.2,
                        }}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-slate-400 mb-4">Not sure which role to choose?</p>
          <Button
            variant="outline"
            className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 rounded-xl bg-transparent"
          >
            Take Our Quiz
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
