"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ProtectedRoute from "@/components/protected-route"
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
  Linkedin,
  Github,
  Twitter,
  Globe,
  ExternalLink,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Camera } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

interface UserProfile {
  id?: number
  username: string
  email: string
  role: string
  bio: string
  profile: string
  name?: string
  date_joined?: string
  is_active?: boolean
  social_links?: {
    linkedin?: string
    github?: string
    twitter?: string
    website?: string
  }
}

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
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const { accessToken } = useAuth()
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: "",
    email: "",
    role: "",
    bio: "",
    profile: "",
    name: "",
    social_links: {
      linkedin: "",
      github: "",
      twitter: "",
      website: ""
    }
  })
  
  const [editForm, setEditForm] = useState<UserProfile>({
    username: "",
    email: "",
    role: "", 
    bio: "",
    profile: "",
    name: "",
    social_links: {
      linkedin: "",
      github: "",
      twitter: "",
      website: ""
    }
  })
  
  const [profileError, setProfileError] = useState<string | null>(null)

  // Get username from localStorage if available (Google Auth scenario)
  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername && !userProfile.username) {
      setUserProfile(prev => ({ ...prev, username: storedUsername }))
      setEditForm(prev => ({ ...prev, username: storedUsername }))
    }
  }, [])

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        setProfileError(null)
        
        const response = await fetch(`${BASE_URL}/api/users/profile/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Profile data received:', data) // Debug log
          
          // Structure the profile data properly
          const profileData: UserProfile = {
            id: data.id,
            username: data.username || "",
            email: data.email || "",
            role: data.role || "student", // Default to student if no role
            bio: data.bio || "",
            profile: data.profile || data.profile_image || "", // Handle both field names
            name: data.name || "",
            date_joined: data.date_joined,
            is_active: data.is_active,
            social_links: {
              linkedin: data.social_links?.linkedin || data.linkedin || "",
              github: data.social_links?.github || data.github || "",
              twitter: data.social_links?.twitter || data.twitter || "",
              website: data.social_links?.website || data.website || ""
            }
          }
          
          console.log('Structured profile data:', profileData) // Debug log
          
          setUserProfile(profileData)
          setEditForm(profileData)
          
          // Update localStorage username if it was set
          if (profileData.username) {
            localStorage.setItem('username', profileData.username)
          }
        } else if (response.status === 404) {
          // Profile doesn't exist yet, use default values
          console.log('Profile not found, using defaults')
          const storedUsername = localStorage.getItem('username')
          const defaultProfile: UserProfile = {
            username: storedUsername || "",
            email: "", // This should come from auth
            role: "student",
            bio: "",
            profile: "",
            name: "",
            social_links: {
              linkedin: "",
              github: "",
              twitter: "",
              website: ""
            }
          }
          setUserProfile(defaultProfile)
          setEditForm(defaultProfile)
        } else {
          const errorData = await response.json()
          console.error('Profile fetch failed:', errorData)
          setProfileError(errorData.detail || 'Failed to load profile')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setProfileError('Network error while loading profile')
      } finally {
        setIsLoading(false)
      }
    }

    if (accessToken) {
      fetchProfile()
    }
  }, [accessToken])

  // Refresh profile data
  const refreshProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/profile/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const profileData: UserProfile = {
          id: data.id,
          username: data.username || "",
          email: data.email || "",
          role: data.role || "student",
          bio: data.bio || "",
          profile: data.profile || data.profile_image || "",
          name: data.name || "",
          date_joined: data.date_joined,
          is_active: data.is_active,
          social_links: {
            linkedin: data.social_links?.linkedin || data.linkedin || "",
            github: data.social_links?.github || data.github || "",
            twitter: data.social_links?.twitter || data.twitter || "",
            website: data.social_links?.website || data.website || ""
          }
        }
        setUserProfile(profileData)
        setEditForm(profileData)
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original data if canceling
      setEditForm(userProfile)
      setSelectedImageFile(null)
      setImagePreview(null)
      setUsernameError(null)
    }
    setIsEditing(!isEditing)
  }

  // Check if username is available
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === userProfile.username) {
      setUsernameError(null)
      return true
    }

    try {
      setIsCheckingUsername(true)
      const response = await fetch(`${BASE_URL}/api/users/check-username/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()
      
      if (response.ok) {
        // Check if the response has 'available' field, otherwise fallback to checking message
        if (data.hasOwnProperty('available')) {
          if (data.available) {
            setUsernameError(null)
            return true
          } else {
            setUsernameError('Username already exists')
            return false
          }
        } else {
          // Fallback: if response is 200 and no 'available' field, assume available
          setUsernameError(null)
          return true
        }
      } else {
        // If response is not OK, check for error message
        const errorMessage = data.msg || data.message || 'Username already exists'
        setUsernameError(errorMessage)
        return false
      }
    } catch (error) {
      console.error('Error checking username:', error)
      setUsernameError('Error checking username')
      return false
    } finally {
      setIsCheckingUsername(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Only check username if it's being changed and user doesn't have one
      if (editForm.username !== userProfile.username) {
        const isUsernameAvailable = await checkUsernameAvailability(editForm.username)
        if (!isUsernameAvailable) {
          setIsSaving(false)
          return
        }
      }
      
      // Create FormData to send both text data and image
      const formData = new FormData()
      formData.append('username', editForm.username || "")
      formData.append('role', editForm.role || "")
      formData.append('bio', editForm.bio || "")
      if (editForm.name) formData.append('name', editForm.name)
      
      // Add social links
      if (editForm.social_links?.linkedin) formData.append('linkedin', editForm.social_links.linkedin)
      if (editForm.social_links?.github) formData.append('github', editForm.social_links.github)
      if (editForm.social_links?.twitter) formData.append('twitter', editForm.social_links.twitter)
      if (editForm.social_links?.website) formData.append('website', editForm.social_links.website)
      
      // Add image file if selected
      if (selectedImageFile) {
        formData.append('profile_image', selectedImageFile)
      }
      
      const response = await fetch(`${BASE_URL}/api/users/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      })

      if (response.ok) {
        const updatedData = await response.json()
        
        // Refresh the profile data to get the latest from server
        await refreshProfile()
        
        setIsEditing(false)
        
        // Clear image states after successful save
        setSelectedImageFile(null)
        setImagePreview(null)
        setUsernameError(null)
        
        // Update localStorage username if it was changed
        if (updatedData.username) {
          localStorage.setItem('username', updatedData.username)
        }
        
        alert('Profile updated successfully!')
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        
        // Handle specific username error from backend
        if (errorData.username) {
          setUsernameError(errorData.username[0] || 'Username error')
        } else {
          alert('Failed to update profile')
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setSelectedImageFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear username error when user starts typing
    if (field === 'username') {
      setUsernameError(null)
    }
  }

  const handleSocialLinkChange = (platform: keyof NonNullable<UserProfile['social_links']>, value: string) => {
    setEditForm(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }))
  }

  // Debounced username check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (editForm.username && editForm.username !== userProfile.username) {
        checkUsernameAvailability(editForm.username)
      }
    }, 1000) // Check after 1 second of no typing

    return () => clearTimeout(timeoutId)
  }, [editForm.username])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <DashboardHeader />

        {isLoading ? (
          <div className="container mx-auto px-6 py-8 flex items-center justify-center">
            <motion.div
              className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : profileError ? (
          <div className="container mx-auto px-6 py-8">
            <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/30 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="text-red-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Profile</h2>
                  <p className="text-red-300">{profileError}</p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="container mx-auto px-6 py-8">
          {/* Profile Data Summary - for debugging */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700/30 rounded-2xl mb-6">
              <CardHeader>
                <CardTitle className="text-slate-400 text-sm">Profile Data Summary (Development)</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-500">
                <div className="grid grid-cols-2 gap-2">
                  <div>Username: {userProfile.username || '(empty)'}</div>
                  <div>Email: {userProfile.email || '(empty)'}</div>
                  <div>Role: {userProfile.role || '(empty)'}</div>
                  <div>Bio: {userProfile.bio ? 'Set' : '(empty)'}</div>
                  <div>Name: {userProfile.name || '(empty)'}</div>
                  <div>Profile Image: {userProfile.profile ? 'Set' : '(empty)'}</div>
                  <div>Date Joined: {userProfile.date_joined || '(empty)'}</div>
                  <div>LinkedIn: {userProfile.social_links?.linkedin || '(empty)'}</div>
                  <div>GitHub: {userProfile.social_links?.github || '(empty)'}</div>
                  <div>Twitter: {userProfile.social_links?.twitter || '(empty)'}</div>
                  <div>Website: {userProfile.social_links?.website || '(empty)'}</div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Profile Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
            <CardContent className="p-8">
              {!isEditing ? (
                /* VIEW MODE */
                <div className="space-y-6">
                  {/* Basic Profile Info */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div className="flex items-center space-x-6 mb-6 md:mb-0">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage 
                            src={userProfile.profile || "/placeholder.svg?height=96&width=96"} 
                            alt="Profile" 
                          />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-blue-500 text-white text-2xl">
                            {userProfile.username?.charAt(0)?.toUpperCase() || userProfile.email?.charAt(0)?.toUpperCase() || "U"}
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
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-2">
                          {userProfile.name || userProfile.username || userProfile.email?.split('@')[0] || "Anonymous User"}
                        </h1>
                        {userProfile.username && (
                          <p className="text-slate-400 text-sm mb-1">@{userProfile.username}</p>
                        )}
                        <p className="text-slate-300 text-lg mb-3 capitalize">
                          {userProfile.role || "Student"}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {userProfile.email || "No email set"}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Joined {userProfile.date_joined ? new Date(userProfile.date_joined).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            }) : 'Recently'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleEditToggle}
                      variant="outline"
                      className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">About</h3>
                    {userProfile.bio ? (
                      <p className="text-slate-300">{userProfile.bio}</p>
                    ) : (
                      <p className="text-slate-500 italic">No bio added yet. Click "Edit Profile" to add one!</p>
                    )}
                  </div>

                  {/* Social Links Section */}
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">Social Links</h3>
                    <div className="flex flex-wrap gap-3">
                      {userProfile.social_links?.linkedin && (
                        <a 
                          href={userProfile.social_links.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors group"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                        </a>
                      )}
                      {userProfile.social_links?.github && (
                        <a 
                          href={userProfile.social_links.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 bg-slate-600/20 border border-slate-500/30 rounded-lg hover:bg-slate-600/30 transition-colors group"
                          title="GitHub Profile"
                        >
                          <Github className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
                        </a>
                      )}
                      {userProfile.social_links?.twitter && (
                        <a 
                          href={userProfile.social_links.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-colors group"
                          title="Twitter Profile"
                        >
                          <Twitter className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                        </a>
                      )}
                      {userProfile.social_links?.website && (
                        <a 
                          href={userProfile.social_links.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 bg-emerald-600/20 border border-emerald-500/30 rounded-lg hover:bg-emerald-600/30 transition-colors group"
                          title="Personal Website"
                        >
                          <Globe className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                        </a>
                      )}
                    </div>
                    {(!userProfile.social_links?.linkedin && !userProfile.social_links?.github && 
                      !userProfile.social_links?.twitter && !userProfile.social_links?.website) && (
                      <p className="text-slate-500 italic">No social links added yet. Click "Edit Profile" to add them!</p>
                    )}
                  </div>
                </div>
              ) : (
                /* EDIT MODE */
                <div className="space-y-6">
                  {/* Header with Save/Cancel buttons */}
                  <div className="flex items-center justify-between border-b border-slate-600 pb-4">
                    <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving || usernameError !== null || isCheckingUsername}
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? "Saving..." : isCheckingUsername ? "Checking..." : "Save Changes"}
                      </Button>
                      <Button
                        onClick={handleEditToggle}
                        variant="outline"
                        className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  {/* Profile Image Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage 
                          src={imagePreview || userProfile.profile || "/placeholder.svg?height=96&width=96"} 
                          alt="Profile" 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-blue-500 text-white text-2xl">
                          {editForm.username?.charAt(0)?.toUpperCase() || editForm.email?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <Camera className="w-4 h-4 text-white" />
                      </label>
                    </div>
                    <div className="flex-1">
                      <Label className="text-slate-300">Profile Image</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <label className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg cursor-pointer hover:bg-slate-600/50 transition-colors">
                          <Upload className="w-4 h-4 text-slate-300" />
                          <span className="text-slate-300 text-sm">
                            {selectedImageFile ? selectedImageFile.name : "Choose New Image"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </label>
                        {selectedImageFile && (
                          <span className="text-emerald-400 text-sm">✓ New image selected</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div>
                    <Label htmlFor="name" className="text-slate-300">Name</Label>
                    <Input
                      id="name"
                      value={editForm.name || ""}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-slate-700/50 border-slate-600/50 text-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="username" className="text-slate-300">Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        value={editForm.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className={`bg-slate-700/50 border-slate-600/50 text-white ${
                          usernameError ? 'border-red-500' : 
                          editForm.username && !usernameError && editForm.username !== userProfile.username ? 'border-emerald-500' : ''
                        }`}
                        placeholder="Enter your username"
                        disabled={isCheckingUsername}
                      />
                      {isCheckingUsername && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <motion.div
                            className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                        </div>
                      )}
                    </div>
                    {usernameError && (
                      <p className="text-red-400 text-xs mt-1">{usernameError}</p>
                    )}
                    {editForm.username && !usernameError && editForm.username !== userProfile.username && !isCheckingUsername && (
                      <p className="text-emerald-400 text-xs mt-1">✓ Username available</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="role" className="text-slate-300">Role</Label>
                    <Input
                      id="role"
                      value={editForm.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="bg-slate-700/50 border-slate-600/50 text-white"
                      placeholder="e.g., Student, Developer, Manager"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-slate-300">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="bg-slate-700/50 border-slate-600/50 text-white"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Social Links Section */}
                  <div>
                    <Label className="text-slate-300 text-lg font-semibold">Social Links</Label>
                    <p className="text-slate-400 text-sm mb-4">Add your social media profiles and website</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedin" className="text-slate-300 flex items-center">
                          <Linkedin className="w-4 h-4 mr-2 text-blue-400" />
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          value={editForm.social_links?.linkedin || ""}
                          onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                          className="bg-slate-700/50 border-slate-600/50 text-white"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="github" className="text-slate-300 flex items-center">
                          <Github className="w-4 h-4 mr-2 text-slate-400" />
                          GitHub
                        </Label>
                        <Input
                          id="github"
                          value={editForm.social_links?.github || ""}
                          onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                          className="bg-slate-700/50 border-slate-600/50 text-white"
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter" className="text-slate-300 flex items-center">
                          <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                          Twitter
                        </Label>
                        <Input
                          id="twitter"
                          value={editForm.social_links?.twitter || ""}
                          onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                          className="bg-slate-700/50 border-slate-600/50 text-white"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website" className="text-slate-300 flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-emerald-400" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={editForm.social_links?.website || ""}
                          onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                          className="bg-slate-700/50 border-slate-600/50 text-white"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
        )}
      </div>
    </ProtectedRoute>
  )
}
