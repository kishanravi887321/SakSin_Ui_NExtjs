"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, RotateCcw, Star, TrendingUp, Clock, Brain } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const feedbackData = [
  {
    question: "Tell me about yourself and your background in software engineering.",
    emotion: "😊",
    emotionLabel: "Confident",
    score: 85,
    feedback:
      "Great introduction! You clearly articulated your background and showed enthusiasm. Consider adding more specific examples of your technical achievements.",
    timestamp: "0:00 - 2:30",
  },
  {
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    emotion: "🤔",
    emotionLabel: "Thoughtful",
    score: 78,
    feedback:
      "Good use of the STAR method. Your problem-solving approach was clear. Try to quantify the impact of your solution more specifically.",
    timestamp: "2:30 - 5:15",
  },
  {
    question: "How do you approach debugging a complex issue in production?",
    emotion: "😐",
    emotionLabel: "Focused",
    score: 92,
    feedback:
      "Excellent systematic approach! You demonstrated strong technical knowledge and methodical thinking. This was your strongest answer.",
    timestamp: "5:15 - 7:45",
  },
  {
    question: "What's your experience with system design and scalability?",
    emotion: "😟",
    emotionLabel: "Uncertain",
    score: 65,
    feedback:
      "You showed some knowledge but seemed less confident. Consider practicing system design concepts and drawing diagrams to support your explanations.",
    timestamp: "7:45 - 10:30",
  },
  {
    question: "How do you stay updated with new technologies and best practices?",
    emotion: "😌",
    emotionLabel: "Relaxed",
    score: 88,
    feedback:
      "Great passion for learning! You mentioned specific resources and showed genuine interest in growth. Well done!",
    timestamp: "10:30 - 12:00",
  },
]

const overallStats = {
  averageScore: 82,
  totalTime: "12:00",
  strongestArea: "Technical Problem Solving",
  improvementArea: "System Design Confidence",
}

export default function FeedbackPage() {
  const [typingIndex, setTypingIndex] = useState(-1)
  const [typedText, setTypedText] = useState<string[]>([])
  const [showStats, setShowStats] = useState(false)

  // Typewriter effect for feedback
  useEffect(() => {
    if (typingIndex >= 0 && typingIndex < feedbackData.length) {
      const feedback = feedbackData[typingIndex].feedback
      let i = 0
      const typeInterval = setInterval(() => {
        if (i <= feedback.length) {
          setTypedText((prev) => {
            const newText = [...prev]
            newText[typingIndex] = feedback.slice(0, i)
            return newText
          })
          i++
        } else {
          clearInterval(typeInterval)
          setTimeout(() => {
            if (typingIndex < feedbackData.length - 1) {
              setTypingIndex((prev) => prev + 1)
            } else {
              setShowStats(true)
            }
          }, 500)
        }
      }, 30)

      return () => clearInterval(typeInterval)
    }
  }, [typingIndex])

  // Start typing animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setTypingIndex(0)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
            animate={{
              x: [0, 150, 0],
              y: [0, -150, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 12 + 8,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 4,
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
        className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-700/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/roles">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Roles
            </Button>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-2xl">✨</span>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 rounded-xl bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded-xl bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-12">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Interview Feedback
          </h1>
          <p className="text-xl text-slate-300">Here's your detailed performance analysis with AI-generated insights</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-emerald-400" />
                    Performance Timeline
                  </h2>

                  <div className="space-y-8">
                    {feedbackData.map((item, index) => (
                      <motion.div
                        key={index}
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-12 w-0.5 h-full bg-slate-600" />

                        <div className="flex items-start space-x-6">
                          {/* Timeline Dot */}
                          <motion.div
                            className="relative z-10 w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                            animate={{
                              scale: typingIndex === index ? [1, 1.1, 1] : 1,
                              boxShadow:
                                typingIndex === index
                                  ? [
                                      "0 0 0 0 rgba(16, 185, 129, 0.7)",
                                      "0 0 0 10px rgba(16, 185, 129, 0)",
                                      "0 0 0 0 rgba(16, 185, 129, 0)",
                                    ]
                                  : "0 0 0 0 rgba(16, 185, 129, 0)",
                            }}
                            transition={{ duration: 2, repeat: typingIndex === index ? Number.POSITIVE_INFINITY : 0 }}
                          >
                            <span className="text-white font-bold">{index + 1}</span>
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 pb-8">
                            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30">
                              {/* Question Header */}
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-slate-400">{item.timestamp}</span>
                                <div className="flex items-center space-x-3">
                                  <motion.span
                                    className="text-2xl"
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
                                    {item.emotion}
                                  </motion.span>
                                  <span className="text-sm text-emerald-400 font-semibold">{item.emotionLabel}</span>
                                </div>
                              </div>

                              {/* Question */}
                              <h3 className="text-white font-semibold mb-4">{item.question}</h3>

                              {/* Score */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-slate-400">Score</span>
                                  <span className="text-emerald-400 font-bold">{item.score}/100</span>
                                </div>
                                <Progress value={item.score} className="h-2 bg-slate-700" />
                              </div>

                              {/* AI Feedback */}
                              <div className="bg-slate-900/50 rounded-xl p-4">
                                <div className="flex items-center mb-2">
                                  <Brain className="w-4 h-4 text-emerald-400 mr-2" />
                                  <span className="text-sm text-emerald-400 font-semibold">AI Feedback</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                  {typedText[index] || (typingIndex > index ? item.feedback : "")}
                                  {typingIndex === index && (
                                    <motion.span
                                      className="inline-block w-0.5 h-4 bg-emerald-400 ml-1"
                                      animate={{ opacity: [0, 1, 0] }}
                                      transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                                    />
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Overall Score */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: showStats ? 1 : 0, x: showStats ? 0 : 50 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border-emerald-500/30 rounded-2xl">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  >
                    <span className="text-2xl font-bold text-white">{overallStats.averageScore}</span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Overall Score</h3>
                  <p className="text-emerald-400">Great Performance!</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showStats ? 1 : 0, y: showStats ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Time</p>
                      <p className="text-white font-bold text-lg">{overallStats.totalTime}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Strongest Area</p>
                      <p className="text-emerald-400 font-bold">{overallStats.strongestArea}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardContent className="p-6">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Improvement Area</p>
                    <p className="text-orange-400 font-bold">{overallStats.improvementArea}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showStats ? 1 : 0, y: showStats ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl py-3">
                <Star className="w-4 h-4 mr-2" />
                Practice More Questions
              </Button>

              <Button
                variant="outline"
                className="w-full border-slate-500/50 text-slate-300 hover:bg-slate-800/50 rounded-xl py-3 bg-transparent"
              >
                Share Results
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
