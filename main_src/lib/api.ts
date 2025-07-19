// API Configuration and utilities
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  INTERVIEW: {
    START: `${BASE_URL}/api/central/v1/interview/start/`,
    SUBMIT_ANSWER: `${BASE_URL}/api/central/v1/interview/answer/`,
    END: `${BASE_URL}/api/central/v1/interview/end/`,
  },
  AUTH: {
    LOGIN: `${BASE_URL}/api/users/auth/login/`,
    GOOGLE: `${BASE_URL}/api/users/auth/google/`,
  },
  USER: {
    PROFILE: `${BASE_URL}/api/users/profile/`,
  }
}

// Interview configuration types
export interface InterviewConfig {
  role: string
  interview_type: 'technical' | 'behavioral' | 'coding' | 'system_design' | 'mixed'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  duration_minutes: number
  experience: string
  position: string
  industry: string
  skills: string[]
  custom_questions?: string[]
}

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  profile_picture?: string
  is_active: boolean
  date_joined: string
}

export interface InterviewSession {
  session_id: string
  user_id: string
  config: InterviewConfig
  questions: string[]
  responses: any[]
  start_time: string
  status: 'active' | 'completed' | 'paused'
  current_question_index: number
}

export interface ApiResponse<T> {
  status: 'success' | 'error' | 'continue'
  message?: string
  data?: T
  session_id?: string
  question?: string
  next_question?: string
  feedback?: {
    status: string
    feedback: string
    score: number
    strengths: string[]
    improvements: string[]
    suggestions: string[]
    overall_assessment: string
    context: {
      role: string
      experience: string
      timestamp: string
    }
  }
  progress?: {
    current_question: number
    total_questions: number
  }
  session_info?: {
    role: string
    experience: string
    industry: string
    question_number: number
    total_questions: number
  }
}

// API utility functions
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem('accessToken')
    
    console.log('🔥 Making API request:', {
      url,
      method: options.method || 'GET',
      hasToken: !!token,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      }
    })

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries())
    })

    // Clone response to read it multiple times
    const responseClone = response.clone()
    const responseText = await responseClone.text()
    console.log('📄 Raw response text:', responseText)

    if (!response.ok) {
      console.error('❌ HTTP Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        responseBody: responseText
      })
      
      let errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`
      if (responseText) {
        errorMessage += `\nResponse: ${responseText}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('✅ Parsed JSON response:', JSON.stringify(data, null, 2))
    return data
  } catch (error) {
    console.error('💥 API request error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url,
      stack: error instanceof Error ? error.stack : undefined
    })
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Network request failed',
    }
  }
}

export const startInterview = async (config: InterviewConfig): Promise<ApiResponse<InterviewSession>> => {
  console.log('🎯 startInterview called with config:', JSON.stringify(config, null, 2))
  
  const result = await apiRequest<InterviewSession>(API_ENDPOINTS.INTERVIEW.START, {
    method: 'POST',
    body: JSON.stringify(config),
  })
  
  console.log('🎯 startInterview result:', JSON.stringify(result, null, 2))
  return result
}

export const submitAnswer = async (sessionId: string, answer: string): Promise<ApiResponse<any>> => {
  console.log('💬 submitAnswer called:', { sessionId, answer })
  
  const result = await apiRequest<any>(API_ENDPOINTS.INTERVIEW.SUBMIT_ANSWER, {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      answer: answer,
    }),
  })
  
  console.log('💬 submitAnswer result:', JSON.stringify(result, null, 2))
  return result
}

// User profile API
export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  console.log('👤 getUserProfile called')
  
  const result = await apiRequest<UserProfile>(API_ENDPOINTS.USER.PROFILE, {
    method: 'GET',
  })
  
  console.log('👤 getUserProfile result:', JSON.stringify(result, null, 2))
  return result
}
