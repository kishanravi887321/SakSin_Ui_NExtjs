import { useState, useEffect } from 'react'
import { UserProfile, getUserProfile } from '@/lib/api'
import { useAuth } from './use-auth'

export interface UserState {
  user: UserProfile | null
  isLoading: boolean
  error: string | null
}

export const useUser = (): UserState & {
  refreshUser: () => Promise<void>
  clearUser: () => void
} => {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [userState, setUserState] = useState<UserState>({
    user: null,
    isLoading: true,
    error: null,
  })

  const fetchUserProfile = async () => {
    if (!isAuthenticated) {
      setUserState({
        user: null,
        isLoading: false,
        error: null,
      })
      return
    }

    try {
      setUserState(prev => ({ ...prev, isLoading: true, error: null }))
      const response = await getUserProfile()
      
      if (response.status === 'success' && response.data) {
        setUserState({
          user: response.data,
          isLoading: false,
          error: null,
        })
      } else {
        setUserState({
          user: null,
          isLoading: false,
          error: response.message || 'Failed to load user profile',
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchUserProfile()
    }
  }, [isAuthenticated, authLoading])

  const refreshUser = async () => {
    await fetchUserProfile()
  }

  const clearUser = () => {
    setUserState({
      user: null,
      isLoading: false,
      error: null,
    })
  }

  return {
    ...userState,
    refreshUser,
    clearUser,
  }
}
