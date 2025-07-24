import { useState, useEffect } from 'react'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
}

export const useAuth = (): AuthState & {
  login: (accessToken: string, refreshToken?: string) => void
  logout: () => void
  getTokens: () => { accessToken: string | null; refreshToken: string | null }
} => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    accessToken: null,
  })

  useEffect(() => {
    // Check for existing token on mount
    const checkAuth = () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        setAuthState({
          isAuthenticated: !!accessToken,
          isLoading: false,
          accessToken,
        })
      } catch (error) {
        console.error('Error checking authentication:', error)
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          accessToken: null,
        })
      }
    }

    checkAuth()
  }, [])

  const login = (accessToken: string, refreshToken?: string) => {
    try {
      localStorage.setItem('accessToken', accessToken)
      console.log('Access token stored in localStorage')
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
        console.log('Refresh token stored in localStorage')
      } else {
        console.log('No refresh token provided')
      }
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        accessToken,
      })
    } catch (error) {
      console.error('Error storing tokens:', error)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      console.log('Tokens removed from localStorage')
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const getTokens = () => {
    try {
      return {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
      }
    } catch (error) {
      console.error('Error retrieving tokens:', error)
      return {
        accessToken: null,
        refreshToken: null,
      }
    }
  }

  return {
    ...authState,
    login,
    logout,
    getTokens,
  }
}
