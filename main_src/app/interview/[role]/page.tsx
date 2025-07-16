"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Camera, Mic, MicOff, Video, VideoOff, Play, Pause, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"

const questions = [
  "Tell me about yourself and your background in software engineering.",
  "Describe a challenging project you worked on and how you overcame obstacles.",
  "How do you approach debugging a complex issue in production?",
  "What's your experience with system design and scalability?",
  "How do you stay updated with new technologies and best practices?",
]

const emotions = ["😊", "😐", "😟", "🤔", "😤", "😌"]
const emotionLabels = ["Confident", "Neutral", "Nervous", "Thinking", "Frustrated", "Calm"]

export default function LiveInterview() {
  const params = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [currentEmotion, setCurrentEmotion] = useState(0)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [questionText, setQuestionText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Typewriter effect for questions
  useEffect(() => {
    if (questions[currentQuestion]) {
      setIsTyping(true)
      setQuestionText("")
      let i = 0
      const question = questions[currentQuestion]

      const typeInterval = setInterval(() => {
        if (i < question.length) {
          setQuestionText(question.slice(0, i + 1))
          i++
        } else {
          setIsTyping(false)
          clearInterval(typeInterval)
        }
      }, 50)

      return () => clearInterval(typeInterval)
    }
  }, [currentQuestion])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  // Random emotion changes
  useEffect(() => {
    const emotionInterval = setInterval(() => {
      setCurrentEmotion(Math.floor(Math.random() * emotions.length))
    }, 3000)
    return () => clearInterval(emotionInterval)
  }, [])

  // Get user media
  useEffect(() => {
    if (videoRef.current && videoEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: audioEnabled })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => console.log("Error accessing camera:", err))
    }
  }, [videoEnabled, audioEnabled])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Navigate to feedback page
      window.location.href = "/feedback"
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
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

          {/* Progress Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">Progress</span>
              <div className="flex-1">
                <Progress value={progress} className="h-2 bg-slate-700" />
              </div>
              <span className="text-sm text-emerald-400 font-semibold">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
          </div>

          {/* Timer */}
          <motion.div
            className="flex items-center space-x-2 text-emerald-400"
            animate={{
              scale: isRecording ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: isRecording ? Number.POSITIVE_INFINITY : 0,
            }}
          >
            <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-red-500" : "bg-slate-500"}`} />
            <span className="font-mono text-lg">{formatTime(timeElapsed)}</span>
          </motion.div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl overflow-hidden">
                <CardContent className="p-0 relative">
                  {/* Video Container */}
                  <div className="aspect-video bg-slate-900 relative overflow-hidden">
                    {videoEnabled ? (
                      <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <div className="text-center">
                          <Camera className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                          <p className="text-slate-400">Camera is off</p>
                        </div>
                      </div>
                    )}

                    {/* Emotion Indicator */}
                    <motion.div
                      className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-xl p-3"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <div className="flex items-center space-x-2">
                        <motion.span
                          className="text-2xl"
                          key={currentEmotion}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {emotions[currentEmotion]}
                        </motion.span>
                        <span className="text-sm text-emerald-400 font-semibold">{emotionLabels[currentEmotion]}</span>
                      </div>
                    </motion.div>

                    {/* Recording Indicator */}
                    <AnimatePresence>
                      {isRecording && (
                        <motion.div
                          className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        >
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          />
                          <span className="text-white text-sm font-semibold">REC</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Controls */}
                  <div className="p-6 bg-slate-800/30">
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVideoEnabled(!videoEnabled)}
                        className={`rounded-xl ${videoEnabled ? "border-emerald-500/50 text-emerald-400" : "border-red-500/50 text-red-400"}`}
                      >
                        {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className={`rounded-xl ${audioEnabled ? "border-emerald-500/50 text-emerald-400" : "border-red-500/50 text-red-400"}`}
                      >
                        {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </Button>

                      <Button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`rounded-xl px-6 ${
                          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                      >
                        {isRecording ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isRecording ? "Pause" : "Start"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTimeElapsed(0)
                          setIsRecording(false)
                        }}
                        className="rounded-xl border-slate-500/50 text-slate-400"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Question Panel */}
          <div className="space-y-6">
            {/* Current Question */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-emerald-400">Question {currentQuestion + 1}</h3>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full"
                    />
                  </div>

                  <motion.p className="text-white text-lg leading-relaxed" key={currentQuestion}>
                    {questionText}
                    {isTyping && (
                      <motion.span
                        className="inline-block w-0.5 h-6 bg-emerald-400 ml-1"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Button
                      onClick={nextQuestion}
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl py-3"
                      disabled={!isRecording}
                    >
                      {currentQuestion === questions.length - 1 ? "Finish Interview" : "Next Question"}
                    </Button>

                    <p className="text-sm text-slate-400 text-center">
                      {isRecording ? "Recording your response..." : "Start recording to continue"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-sm border-emerald-500/20 rounded-2xl">
                <CardContent className="p-6">
                  <h4 className="text-emerald-400 font-semibold mb-3">💡 Interview Tips</h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li>• Maintain eye contact with the camera</li>
                    <li>• Speak clearly and at a moderate pace</li>
                    <li>• Use the STAR method for behavioral questions</li>
                    <li>• Take a moment to think before answering</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
