// Unified user profile types and utilities
export interface UnifiedUserProfile {
  // Core fields that might come from different API formats
  id?: string | number
  email: string
  
  // Name fields - API might return first_name/last_name OR name OR username
  first_name?: string
  last_name?: string
  name?: string
  username?: string
  
  // Image fields - API might return profile_picture OR photo OR profile
  profile_picture?: string
  photo?: string
  profile?: string
  
  // Other common fields
  role?: string
  bio?: string
  is_active?: boolean
  date_joined?: string
  
  // Social links
  social_links?: {
    linkedin?: string
    github?: string
    twitter?: string
    website?: string
  }
}

// Utility functions to normalize user data from different API formats
export const normalizeUserData = (userData: any): UnifiedUserProfile => {
  if (!userData) return { email: "" }
  
  return {
    id: userData.id,
    email: userData.email || "",
    
    // Normalize name fields
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    name: userData.name || "",
    username: userData.username || "",
    
    // Normalize image fields
    profile_picture: userData.profile_picture || "",
    photo: userData.photo || "",
    profile: userData.profile || "",
    
    // Other fields
    role: userData.role || "student",
    bio: userData.bio || "",
    is_active: userData.is_active ?? true,
    date_joined: userData.date_joined || "",
    
    // Social links
    social_links: {
      linkedin: userData.social_links?.linkedin || userData.linkedin || "",
      github: userData.social_links?.github || userData.github || "",
      twitter: userData.social_links?.twitter || userData.twitter || "",
      website: userData.social_links?.website || userData.website || ""
    }
  }
}

// Get display name from various name fields
export const getDisplayName = (user: UnifiedUserProfile): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`
  }
  if (user.first_name) {
    return user.first_name
  }
  if (user.name) {
    return user.name
  }
  if (user.username) {
    return user.username
  }
  if (user.email) {
    return user.email.split('@')[0]
  }
  return "User"
}

// Get user initials from various name fields
export const getUserInitials = (user: UnifiedUserProfile): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
  }
  if (user.first_name) {
    return user.first_name.charAt(0).toUpperCase()
  }
  if (user.name) {
    const names = user.name.split(' ')
    return names.length > 1 
      ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      : names[0].charAt(0).toUpperCase()
  }
  if (user.username) {
    return user.username.charAt(0).toUpperCase()
  }
  if (user.email) {
    return user.email.charAt(0).toUpperCase()
  }
  return "U"
}

// Get profile image from various image fields
export const getProfileImage = (user: UnifiedUserProfile): string => {
  return user.profile_picture || user.photo || user.profile || "/placeholder.svg"
}
