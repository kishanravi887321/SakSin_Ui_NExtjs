"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Mail, ArrowLeft, CheckCircle, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    otp: ""
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Test server connectivity on component mount
  useState(() => {
    const testConnection = async () => {
      try {
        console.log('Testing server connectivity...')
        const response = await fetch(`${BASE_URL}/`, { method: 'GET' })
        console.log('Server connectivity test:', response.status)
      } catch (err) {
        console.error('Server connectivity test failed:', err)
      }
    }
    testConnection()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Debug BASE_URL
    console.log('BASE_URL:', BASE_URL)
    console.log('Environment variables:', {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV
    })

    const endpoint = `${BASE_URL}/api/users/auth/forget-password/`
    console.log('Sending OTP request to:', endpoint)
    console.log('Request payload:', { email: formData.email })

    // Check if email is valid
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      // Test network connectivity first
      console.log('Testing network connectivity...')

      // First hit the auth endpoint to send OTP
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      })

      console.log('Response received!')
      console.log('Response status:', response.status)
      console.log('Response statusText:', response.statusText)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      console.log('Response URL:', response.url)

      // Get response text first to see what we're receiving
      const responseText = await response.text()
      console.log('Raw response text:', responseText)

      let data
      try {
        data = responseText ? JSON.parse(responseText) : {}
        console.log('Parsed response data:', data)
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        console.error('Response was:', responseText)
        throw new Error(`Invalid response format from server. Got: ${responseText.substring(0, 100)}`)
      }

      if (response.ok) {
        setIsEmailSent(true)
        console.log('OTP sent successfully')
      } else {
        console.error('OTP request failed:', data)
        setError(data.detail || data.message || data.error || `Server error: ${response.status} ${response.statusText}`)
      }
    } catch (err) {
      console.error("Forgot password error:", err)

      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Unable to connect to the server. Please check your internet connection and server status.")
      } else if (err instanceof Error && err.message.includes('NetworkError')) {
        setError("Network error: Please check if the server is running and accessible.")
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match!")
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long!")
      setIsLoading(false)
      return
    }

    console.log('Sending password reset request to:', `${BASE_URL}/api/users/forget-password/`)
    console.log('Request payload:', {
      email: formData.email,
      new_password: formData.newPassword,
      otp: formData.otp,
    })

    try {
      // Send email, new password, and OTP to the main forget-password endpoint
      const response = await fetch(`${BASE_URL}/api/users/forget-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          new_password: formData.newPassword,
          otp: formData.otp,
        }),
      })

      console.log('Password reset response status:', response.status)
      console.log('Password reset response headers:', Object.fromEntries(response.headers.entries()))

      let data
      try {
        data = await response.json()
        console.log('Password reset response data:', data)
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        throw new Error('Invalid response format from server')
      }

      if (response.ok) {
        alert("Password reset successfully! Please login with your new password.")
        router.push("/login")
      } else {
        console.error('Password reset failed:', data)
        setError(data.detail || data.message || data.error || "Password reset failed. Please try again.")
      }
    } catch (err) {
      console.error("Password reset error:", err)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Unable to connect to the server. Please check your internet connection.")
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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
                <CardTitle className="text-2xl font-bold text-white mb-2">Reset Your Password</CardTitle>
                <p className="text-slate-400">Enter the OTP sent to {formData.email} and your new password</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handlePasswordReset} className="space-y-6">
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  
                  {/* OTP Field */}
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
                  </div>

                  {/* New Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-300 font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Create a new password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="pl-12 pr-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-300 font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
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

                  {/* Reset Password Button */}
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
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
        {/* Back to Login */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white p-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </Link>
        </motion.div>

        {/* Forgot Password Card */}
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

              <CardTitle className="text-2xl font-bold text-white mb-2">Forgot Password?</CardTitle>
              <p className="text-slate-400">Enter your email to receive an OTP for password reset</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-center">{error}</p>}
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
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-12"
                      required
                    />
                  </div>
                </div>

                {/* Send OTP Button */}
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
                    "Send OTP"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-800/50 text-slate-400">Or go back</span>
                </div>
              </div>

              {/* Back to Sign In Link */}
              <div className="text-center">
                <p className="text-slate-400">
                  Remember your password?{" "}
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
