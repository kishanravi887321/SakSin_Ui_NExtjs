"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

// Extend Window interface for google
declare global {
  interface Window {
    google: any;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL 
console.log('Base URL Registration:', BASE_URL)

export default function SignUpPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [formData, setFormData] = useState({
    username: "", // Changed from firstName/lastName
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Initialize Google Sign-In for signup
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      console.log('Initializing Google Sign-In for signup...')
      console.log('Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
      
      if (window.google && window.google.accounts) {
        console.log('Google accounts available, initializing...')
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleGoogleSignUp,
            auto_select: false,
            cancel_on_tap_outside: true,
          })
          console.log('Google Sign-In initialized successfully for signup')
        } catch (error) {
          console.error('Error initializing Google Sign-In:', error)
        }
      } else {
        console.error('Google accounts not available')
      }
    }

    // Load Google Identity Services script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log('Google script loaded successfully for signup')
      initializeGoogleSignIn()
    }
    script.onerror = (error) => {
      console.error('Failed to load Google script:', error)
    }
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
    if (!existingScript) {
      document.head.appendChild(script)
    } else {
      initializeGoogleSignIn()
    }

    return () => {
      if (script && document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const handleGoogleSignUp = async (response: any) => {
    console.log('Google Sign-Up Response:', response)
    setIsLoading(true)
    setError(null)

    try {
      // Send the ID token to your backend for signup
      const backendResponse = await fetch(`${BASE_URL}/api/users/auth/google/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: response.credential,
        }),
      })

      const data = await backendResponse.json()
      console.log('Backend response:', data)

      if (backendResponse.ok) {
        // Successfully authenticated with Google
        login(data.accessToken, data.refreshToken)
        
        if (data.is_new_user) {
          // New user - redirect to profile completion
          alert('Welcome to SakSin AI! Please complete your profile.')
          router.push('/profile')
        } else {
          // Existing user - redirect to dashboard
          router.push('/dashboard')
        }
      } else {
        setError(data.detail || 'Google authentication failed')
      }
    } catch (error) {
      console.error('Google Sign-Up Error:', error)
      setError('Google authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleButtonClick = () => {
    console.log('Google signup button clicked')
    console.log('Google available:', !!window.google)
    console.log('Google accounts available:', !!window.google?.accounts)
    console.log('Google ID available:', !!window.google?.accounts?.id)
    
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        console.log('Calling Google prompt for signup...')
        window.google.accounts.id.prompt((notification: any) => {
          console.log('Google prompt notification:', notification)
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google prompt was not displayed or skipped')
            // Try alternative method - render button
            renderGoogleButton()
          }
        })
      } catch (error) {
        console.error('Error calling Google prompt:', error)
        setError('Google Sign-In failed to initialize. Please refresh the page and try again.')
      }
    } else {
      console.error('Google Sign-In not properly initialized')
      setError('Google Sign-In is not available. Please refresh the page and try again.')
    }
  }

  const renderGoogleButton = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        // Create a temporary div for the Google button
        const buttonDiv = document.createElement('div')
        buttonDiv.id = 'google-signup-button'
        document.body.appendChild(buttonDiv)
        
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signup_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 250,
        })
        
        // Trigger click on the Google button
        setTimeout(() => {
          const googleButton = buttonDiv.querySelector('div[role="button"]')
          if (googleButton) {
            (googleButton as HTMLElement).click()
            document.body.removeChild(buttonDiv)
          }
        }, 100)
      } catch (error) {
        console.error('Error rendering Google button:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!")
      setIsLoading(false)
      return
    }

    try {
      // First hit the auth URL to send OTP (only email required)
      const authResponse = await fetch(`${BASE_URL}/api/users/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      })

      const authData = await authResponse.json()

      if (authResponse.ok) {
        setShowOtpVerification(true)
        alert(`OTP sent to ${formData.email}. Please verify to complete registration.`)
      } else {
        setError(authData.detail || "Failed to send OTP. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      console.error("Auth error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Send OTP to the main registration API to complete registration
      const response = await fetch(`${BASE_URL}/api/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          username:formData.username,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Account verified and registered successfully! Please sign in to continue.")
        router.push("/login") // Redirect to login page after successful registration
      } else {
        setError(data.detail || "OTP verification failed. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred during OTP verification. Please try again later.")
      console.error("OTP verification error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
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

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white p-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Sign Up Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl shadow-2xl">
            <CardHeader className="text-center pb-8">
              {/* Logo */}
              <motion.div className="flex items-center justify-center space-x-3 mb-6" whileHover={{ scale: 1.05 }}>
                <Sparkles className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  SakSin AI
                </span>
              </motion.div>

              <CardTitle className="text-2xl font-bold text-white mb-2">
                {showOtpVerification ? "Verify Your Email" : "Create Your Account"}
              </CardTitle>
              <p className="text-slate-400">
                {showOtpVerification
                  ? `Enter the OTP sent to ${formData.email} to verify your account`
                  : "Start your AI-powered interview preparation journey"}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && <p className="text-red-500 text-center">{error}</p>}
              {!showOtpVerification ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-300 font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="john_doe"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-12 pr-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-300 font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-12 pr-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                        }
                        className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 mt-1"
                        required
                      />
                      <Label htmlFor="agreeToTerms" className="text-slate-300 text-sm cursor-pointer leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="subscribeNewsletter"
                        name="subscribeNewsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, subscribeNewsletter: checked as boolean }))
                        }
                        className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <Label htmlFor="subscribeNewsletter" className="text-slate-300 text-sm cursor-pointer">
                        Subscribe to our newsletter for interview tips and updates
                      </Label>
                    </div>
                  </div>

                  {/* Sign Up Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.agreeToTerms}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl h-12 text-lg font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-slate-300 font-medium">
                      One-Time Password (OTP)
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={formData.otp}
                        onChange={handleInputChange}
                        className="pl-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-12"
                        maxLength={6}
                        required
                      />
                    </div>
                    <Button variant="link" className="text-emerald-400 hover:text-emerald-300 text-sm p-0 h-auto">
                      Resend OTP
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl h-12 text-lg font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                    ) : (
                      "Verify Account"
                    )}
                  </Button>
                </form>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-800/50 text-slate-400">Or sign up with</span>
                </div>
              </div>

              {/* Social Sign Up */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={handleGoogleButtonClick}
                  disabled={isLoading}
                  variant="outline"
                  className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl h-12 w-full max-w-xs"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-slate-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
