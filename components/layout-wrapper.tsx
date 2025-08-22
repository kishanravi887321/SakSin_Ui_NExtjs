"use client"

import { useAuth } from "@/hooks/use-auth"
import { Chatbot } from "./chatbot"
import { useEffect, useState } from "react"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render chatbot during SSR or while loading auth state
  if (!mounted || isLoading) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      {/* Show chatbot only when user is authenticated */}
      {isAuthenticated && <Chatbot />}
    </>
  )
}
