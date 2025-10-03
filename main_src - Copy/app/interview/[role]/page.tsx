"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera, Mic, MicOff, Video, VideoOff, Play, Pause, RotateCcw, Settings, X, History, ChevronDown, ChevronUp, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { InterviewConfig, startInterview, submitAnswer, ApiResponse, InterviewSession } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { useUser } from "@/hooks/use-user"

// Configuration options based on your backend
const DIFFICULTY_CHOICES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
]

const INTERVIEW_TYPES = [
  { value: 'technical', label: 'Technical Interview' },
  { value: 'behavioral', label: 'Behavioral Interview' },
  { value: 'coding', label: 'Coding Interview' },
  { value: 'system_design', label: 'System Design' },
  { value: 'mixed', label: 'Mixed Interview' }
]

const DURATION_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' }
]

const POPULAR_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Django', 
  'Flask', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'REST API',
  'GraphQL', 'Redis', 'Kubernetes', 'Machine Learning', 'Data Analysis'
]

const emotions = ["😊", "😐", "😟", "🤔", "😤", "😌"]
const emotionLabels = ["Confident", "Neutral", "Nervous", "Thinking", "Frustrated", "Calm"]

export default function LiveInterview() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const { user, isLoading: userLoading } = useUser()
  
  // Setup phase states
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [currentQuestionText, setCurrentQuestionText] = useState("")
  const [previousQuestions, setPreviousQuestions] = useState<Array<{question: string, answer: string, feedback?: any}>>([])
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  
  // Interview configuration
  const [config, setConfig] = useState<InterviewConfig>({
    role: 'interviewer',
    interview_type: 'technical',
    difficulty: 'intermediate',
    duration_minutes: 60,
    experience: '',
    position: '',
    industry: '',
    skills: []
  })
  
  // Current interview states
  const [isRecording, setIsRecording] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [currentEmotion, setCurrentEmotion] = useState(0)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [customQuestions, setCustomQuestions] = useState<string[]>([])
  const [customQuestionInput, setCustomQuestionInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [interviewData, setInterviewData] = useState<{score: number}>({ score: 0 })
  const [showHistory, setShowHistory] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)

  // Initialize role from params
  useEffect(() => {
    if (params.role && typeof params.role === 'string') {
      setConfig(prev => ({ ...prev, position: decodeURIComponent(params.role as string) }))
    }
  }, [params.role])

  // Handle skill addition
  const addSkill = (skill: string) => {
    if (skill.trim() && !config.skills.includes(skill.trim())) {
      setConfig(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setConfig(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  // Handle custom questions
  const addCustomQuestion = () => {
    if (customQuestionInput.trim()) {
      setCustomQuestions(prev => [...prev, customQuestionInput.trim()])
      setCustomQuestionInput("")
    }
  }

  const removeCustomQuestion = (index: number) => {
    setCustomQuestions(prev => prev.filter((_, i) => i !== index))
  }

  // Start interview session
  const startInterviewSession = async () => {
    setIsLoading(true)
    try {
      console.log('🚀 Starting interview with config:', config)
      
      const finalConfig = {
        ...config,
        ...(customQuestions.length > 0 && { custom_questions: customQuestions })
      }
      
      console.log('📝 Final config:', finalConfig)
      
      const response = await startInterview(finalConfig)
      
      console.log('📡 Interview start response:', response)
      
      if (response.status === 'success' && response.session_id) {
        // Store session data
        setSessionId(response.session_id)
        
        // Handle initial question
        const initialQuestion = response.question || response.next_question || "Welcome to your interview!"
        setCurrentQuestionText(initialQuestion)
        
        // Set progress info
        if (response.progress) {
          setCurrentQuestionNumber(response.progress.current_question)
          setTotalQuestions(response.progress.total_questions)
        } else if (response.session_info) {
          setCurrentQuestionNumber(response.session_info.question_number)
          setTotalQuestions(response.session_info.total_questions)
        }
        
        setIsSetupComplete(true)
        
        // Start typewriter effect for first question
        startTypewriter(initialQuestion)
      } else {
        console.error('❌ Interview start failed:', response)
        const errorMessage = response.message || 'Failed to start interview session'
        alert(`Error: ${errorMessage}\n\nPlease check:\n1. Backend server is running on localhost:8000\n2. You are logged in\n3. All required fields are filled`)
      }
    } catch (error) {
      console.error('💥 Error starting interview:', error)
      alert(`Network Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check:\n1. Your internet connection\n2. Backend server is running\n3. CORS settings`)
    } finally {
      setIsLoading(false)
    }
  }

  // Typewriter effect for questions
  const startTypewriter = (question: string) => {
    setIsTyping(true)
    setCurrentQuestionText("")
    let i = 0

    const typeInterval = setInterval(() => {
      if (i < question.length) {
        setCurrentQuestionText(question.slice(0, i + 1))
        i++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 50)
  }

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && isSetupComplete) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isSetupComplete])

  // Random emotion changes
  useEffect(() => {
    if (isSetupComplete) {
      const emotionInterval = setInterval(() => {
        setCurrentEmotion(Math.floor(Math.random() * emotions.length))
      }, 3000)
      return () => clearInterval(emotionInterval)
    }
  }, [isSetupComplete])

  // Get user media
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator?.mediaDevices && videoRef.current && videoEnabled && isSetupComplete) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: audioEnabled })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.log("Error accessing camera:", err)
          // Handle specific errors
          if (err.name === 'NotAllowedError') {
            console.log("Camera access denied by user")
          } else if (err.name === 'NotFoundError') {
            console.log("No camera found")
          } else if (err.name === 'NotSupportedError') {
            console.log("Camera not supported in this browser")
          }
        })
    } else if (typeof window !== 'undefined' && !navigator?.mediaDevices) {
      console.log("Media devices not supported in this browser")
    }
  }, [videoEnabled, audioEnabled, isSetupComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const nextQuestion = async () => {
    if (!sessionId || !currentAnswer.trim()) {
      alert('Please provide an answer before proceeding')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      console.log('📤 Submitting answer:', { sessionId, answer: currentAnswer })
      const submitResponse = await submitAnswer(sessionId, currentAnswer)
      console.log('📥 Submit response:', submitResponse)
      
      if (submitResponse.status === 'continue' || submitResponse.status === 'success') {
        // Save the current question and answer with feedback
        setPreviousQuestions(prev => [...prev, {
          question: currentQuestionText,
          answer: currentAnswer,
          feedback: submitResponse.feedback
        }])
        
        // Update interview data and score
        if (submitResponse.feedback && submitResponse.feedback.score) {
          setInterviewData(prev => ({
            ...prev,
            score: submitResponse.feedback!.score
          }))
        }
        
        // Clear current answer
        setCurrentAnswer("")
        
        // Update progress
        if (submitResponse.progress) {
          setCurrentQuestionNumber(submitResponse.progress.current_question)
          setTotalQuestions(submitResponse.progress.total_questions)
        }
        
        // Display next question
        if (submitResponse.next_question) {
          setCurrentQuestionText(submitResponse.next_question)
          startTypewriter(submitResponse.next_question)
        } else {
          // Interview completed
          alert('Interview completed! Thank you for participating.')
          window.location.href = "/feedback"
        }
      } else {
        alert('Failed to submit answer: ' + (submitResponse.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('💥 Error submitting answer:', error)
      alert('Failed to submit answer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = totalQuestions > 0 ? (currentQuestionNumber / totalQuestions) * 100 : 0

  // Authentication protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading while checking authentication
  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Authentication Required</h1>
          <p className="text-slate-400 mb-6">Please log in to take the assessment</p>
          <Button onClick={() => router.push('/login')} className="bg-emerald-500 hover:bg-emerald-600">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  // Logout handler
  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Setup Phase UI
  if (!isSetupComplete) {
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
          <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/roles">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Roles
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl font-semibold text-white">Interview Setup</h1>
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={user?.profile_picture} 
                      alt={`${user?.first_name} ${user?.last_name}`}
                    />
                    <AvatarFallback className="bg-emerald-500 text-white">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-slate-800 border-slate-700" align="end">
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user?.profile_picture} 
                      alt={`${user?.first_name} ${user?.last_name}`}
                    />
                    <AvatarFallback className="bg-emerald-500 text-white text-xs">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-white">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700" onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700" onClick={() => router.push('/dashboard')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  className="text-red-400 hover:text-red-300 hover:bg-slate-700" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.header>

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center">
                  Configure Your Interview Experience
                </CardTitle>
                <p className="text-slate-400 text-center">
                  Customize your interview based on your experience and the role you're targeting
                </p>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Configuration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-emerald-400">Basic Details</h3>
                    
                    <div>
                      <Label className="text-slate-300">Interview Type</Label>
                      <Select value={config.interview_type} onValueChange={(value: any) => setConfig(prev => ({ ...prev, interview_type: value }))}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {INTERVIEW_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-700">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-slate-300">Difficulty Level</Label>
                      <Select value={config.difficulty} onValueChange={(value: any) => setConfig(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {DIFFICULTY_CHOICES.map(diff => (
                            <SelectItem key={diff.value} value={diff.value} className="text-white hover:bg-slate-700">
                              {diff.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-slate-300">Duration</Label>
                      <Select value={config.duration_minutes.toString()} onValueChange={(value) => setConfig(prev => ({ ...prev, duration_minutes: parseInt(value) }))}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {DURATION_OPTIONS.map(duration => (
                            <SelectItem key={duration.value} value={duration.value.toString()} className="text-white hover:bg-slate-700">
                              {duration.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-slate-300">Position/Role</Label>
                      <Input
                        value={config.position}
                        onChange={(e) => setConfig(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="e.g., Backend Developer"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300">Years of Experience</Label>
                      <Input
                        value={config.experience}
                        onChange={(e) => setConfig(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g., 3 years in Python development"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300">Industry</Label>
                      <Input
                        value={config.industry}
                        onChange={(e) => setConfig(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="e.g., fintech, e-commerce, startup"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Skills and Custom Questions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-emerald-400">Skills & Preferences</h3>
                    
                    <div>
                      <Label className="text-slate-300">Technical Skills</Label>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder="Add a skill..."
                            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                            onKeyPress={(e) => e.key === 'Enter' && addSkill(skillInput)}
                          />
                          <Button 
                            onClick={() => addSkill(skillInput)}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            Add
                          </Button>
                        </div>
                        
                        {/* Popular Skills */}
                        <div className="space-y-2">
                          <p className="text-sm text-slate-400">Quick add popular skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {POPULAR_SKILLS.map(skill => (
                              <Button
                                key={skill}
                                variant="outline"
                                size="sm"
                                onClick={() => addSkill(skill)}
                                className="border-slate-600 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500"
                                disabled={config.skills.includes(skill)}
                              >
                                {skill}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Selected Skills */}
                        {config.skills.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm text-slate-400">Selected skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {config.skills.map(skill => (
                                <Badge key={skill} variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                                  {skill}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSkill(skill)}
                                    className="ml-1 h-auto p-0 text-emerald-400 hover:text-red-400"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300">Custom Questions (Optional)</Label>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Textarea
                            value={customQuestionInput}
                            onChange={(e) => setCustomQuestionInput(e.target.value)}
                            placeholder="Add a custom question..."
                            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                            rows={2}
                          />
                          <Button 
                            onClick={addCustomQuestion}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Add
                          </Button>
                        </div>

                        {/* Custom Questions List */}
                        {customQuestions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm text-slate-400">Custom questions:</p>
                            {customQuestions.map((question, index) => (
                              <div key={index} className="bg-slate-700/30 p-3 rounded-lg flex justify-between items-start">
                                <p className="text-slate-300 text-sm flex-1">{question}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCustomQuestion(index)}
                                  className="text-red-400 hover:text-red-300 ml-2"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <Button
                    onClick={startInterviewSession}
                    disabled={isLoading || !config.position || !config.experience || !config.industry || config.skills.length === 0}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl text-lg"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Play className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? 'Setting up...' : 'Start Interview'}
                  </Button>
                </div>

                {/* Debug Info */}
                <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">🔧 Debug Info</h4>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</p>
                    <p>Has Access Token: {typeof window !== 'undefined' && localStorage.getItem('accessToken') ? '✅ Yes' : '❌ No'}</p>
                    <p>Required Fields: {!config.position ? '❌ Position' : '✅ Position'} | {!config.experience ? '❌ Experience' : '✅ Experience'} | {!config.industry ? '❌ Industry' : '✅ Industry'} | {config.skills.length === 0 ? '❌ Skills' : '✅ Skills'}</p>
                    <p>Skills Count: {config.skills.length}</p>
                    <p>Custom Questions: {customQuestions.length}</p>
                    <p>Session ID: {sessionId || 'Not started'}</p>
                    <p>Current Question: {currentQuestionNumber}/{totalQuestions}</p>
                    <p>Previous Questions: {previousQuestions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Top Header - Compact Design */}
      <div className="h-14 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Link href="/roles" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Roles</span>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-sm mx-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Q{currentQuestionNumber}/{totalQuestions}</span>
            <div className="flex-1">
              <Progress value={progress} className="h-1.5 bg-slate-700" />
            </div>
          </div>
        </div>

        {/* Timer and Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <div className={`w-1.5 h-1.5 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-slate-500"}`} />
            <span className="font-mono text-sm">{formatTime(timeElapsed)}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-700 p-0"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </Button>
            <div className="text-slate-400 text-xs font-mono">
              {interviewData.score || 0}
            </div>
          </div>

          {/* User Profile - Compact */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user?.profile_picture} 
                    alt={`${user?.first_name} ${user?.last_name}`}
                  />
                  <AvatarFallback className="bg-emerald-500 text-white text-xs">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
              <div className="flex items-center space-x-2 p-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage 
                    src={user?.profile_picture} 
                    alt={`${user?.first_name} ${user?.last_name}`}
                  />
                  <AvatarFallback className="bg-emerald-500 text-white text-xs">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-white">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                className="text-red-400 hover:text-red-300 hover:bg-slate-700 text-xs" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-3 w-3" />
                Exit Interview & Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content - Better Proportioned Layout */}
      <div className="h-[calc(100vh-3.5rem)] flex">
        
        {/* Left Side - Video Feed (75%) */}
        <div className="w-3/4 flex flex-col bg-slate-900 relative">
          
          {/* Video Container - More Reasonable Size */}
          <div className="h-96 relative rounded-lg overflow-hidden m-4 bg-slate-800">
            {videoEnabled ? (
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 rounded-lg">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">Camera is disabled</p>
                  <p className="text-slate-500 text-sm mt-2">Enable camera to start video recording</p>
                </div>
              </div>
            )}

            {/* Overlay Elements */}
            <div className="absolute inset-0 pointer-events-none">
              
              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4">
                  <div className="bg-red-500/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-sm font-semibold">REC</span>
                  </div>
                </div>
              )}

              {/* Emotion Indicator */}
              <div className="absolute top-4 right-4">
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{emotions[currentEmotion]}</span>
                    <span className="text-emerald-400 font-medium text-sm">{emotionLabels[currentEmotion]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Question Card - Below Video */}
          <div className="flex-1 m-4">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-6 h-full border border-slate-700/50">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-emerald-400 font-semibold text-xl">Question {currentQuestionNumber}</h3>
                {isTyping && (
                  <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              
              <div className="text-white text-lg leading-relaxed max-h-64 overflow-y-auto">
                {currentQuestionText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 bg-emerald-400 ml-1 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Video Controls Bar - Compact */}
          <div className="h-16 bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 flex items-center justify-center space-x-4 mx-4 mb-4 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`w-10 h-10 rounded-lg ${videoEnabled ? "text-emerald-400 hover:bg-emerald-400/10" : "text-red-400 hover:bg-red-400/10"}`}
            >
              {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`w-10 h-10 rounded-lg ${audioEnabled ? "text-emerald-400 hover:bg-emerald-400/10" : "text-red-400 hover:bg-red-400/10"}`}
            >
              {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>

            <Button
              onClick={() => setIsRecording(!isRecording)}
              size="sm"
              className={`w-12 h-10 rounded-lg font-semibold ${
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTimeElapsed(0)
                setIsRecording(false)
              }}
              className="w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right Sidebar - Answer & Controls (25%) */}
        <div className="w-1/4 bg-slate-800/50 border-l border-slate-700 flex flex-col">
          
          {/* Answer Input Section */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="mb-4">
              <Label className="text-slate-300 font-medium mb-3 block">Your Answer</Label>
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your detailed answer here..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none h-32 focus:border-emerald-500 text-sm"
              />
              <p className="text-xs text-slate-500 mt-2">
                {currentAnswer.length} characters
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={nextQuestion}
              disabled={isSubmitting || !currentAnswer.trim()}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-2 mb-4 text-sm"
            >
              {isSubmitting 
                ? "Submitting..." 
                : (currentQuestionNumber >= totalQuestions ? "Finish Interview" : "Submit & Next")
              }
            </Button>

            {/* Previous Questions - Collapsible */}
            {previousQuestions.length > 0 && (
              <div className="border-t border-slate-700 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full justify-between text-slate-400 hover:text-white hover:bg-slate-700/50 mb-3 text-sm h-8"
                >
                  <span className="flex items-center space-x-2">
                    <History className="w-3.5 h-3.5" />
                    <span>History</span>
                    <Badge variant="outline" className="text-xs">
                      {previousQuestions.length}
                    </Badge>
                  </span>
                  {showHistory ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </Button>
                
                {showHistory && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="max-h-40 overflow-y-auto space-y-2"
                  >
                    {previousQuestions.slice(-3).map((item, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-lg p-2 text-xs">
                        <p className="text-slate-300 font-medium mb-1">
                          Q{previousQuestions.length - 2 + index}: {item.question.substring(0, 40)}...
                        </p>
                        {item.feedback && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Badge 
                              variant={item.feedback.score >= 7 ? "default" : item.feedback.score >= 4 ? "secondary" : "destructive"}
                              className="text-xs px-1 py-0"
                            >
                              {item.feedback.score}/10
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            {/* Quick Tips */}
            <div className="mt-auto pt-4 border-t border-slate-700">
              <h4 className="text-slate-300 font-medium text-sm mb-2">💡 Tips</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Look at the camera</li>
                <li>• Use STAR method</li>
                <li>• Be specific</li>
                <li>• Take your time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
