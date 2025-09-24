"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import ClientLayout from "@/app/client-layout"
import Image from "next/image"

interface User {
  id: string
  email: string
  role: string
  first_name: string
  last_name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname?.startsWith("/auth")

      if (!token && !isAuthPage) {
        router.push("/auth/login")
      } else if (token && isAuthPage) {
        router.push("/")
      }
    }
  }, [token, pathname, isLoading, router])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    router.push("/auth/login")
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center h-24 w-24 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 animate-pulse p-2">
            <Image 
              src="/images/feasto-logo.png" 
              alt="FEASTO Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-orange-500/30 border-t-pink-500 rounded-full animate-spin"></div>
            <span className="text-white text-lg font-medium bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Loading FEASTO Admin...
            </span>
          </div>
        </div>
      </div>
    )
  }

  const isAuthPage = pathname?.startsWith("/auth")

  return (
    <AuthContext.Provider value={value}>
      {isAuthPage ? children : <ClientLayout>{children}</ClientLayout>}
    </AuthContext.Provider>
  )
}