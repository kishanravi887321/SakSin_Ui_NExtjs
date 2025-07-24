import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Token storage utilities
export const getStoredTokens = () => {
  try {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    }
  } catch (error) {
    console.error('Error retrieving tokens from localStorage:', error)
    return {
      accessToken: null,
      refreshToken: null,
    }
  }
}

export const clearStoredTokens = () => {
  try {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    console.log('All tokens cleared from localStorage')
  } catch (error) {
    console.error('Error clearing tokens from localStorage:', error)
  }
}

export const hasValidTokens = () => {
  const { accessToken } = getStoredTokens()
  return !!accessToken
}
