"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthState, LoginCredentials, RegisterCredentials } from "@/types/auth"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Администратор",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "buyer@example.com",
    name: "Покупатель",
    role: "buyer",
    createdAt: new Date().toISOString(),
  },
]

const STORAGE_KEY = "auth-user"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY)
      if (savedUser) {
        const user = JSON.parse(savedUser)
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user by email
      const user = MOCK_USERS.find((u) => u.email === credentials.email)

      if (!user) {
        return { success: false, error: "Пользователь не найден" }
      }

      // In real app, you would verify password hash
      if (credentials.password !== "password") {
        return { success: false, error: "Неверный пароль" }
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Ошибка входа в систему" }
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingUser = MOCK_USERS.find((u) => u.email === credentials.email)
      if (existingUser) {
        return { success: false, error: "Пользователь с таким email уже существует" }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        role: credentials.role || "buyer",
        createdAt: new Date().toISOString(),
      }

      // In real app, you would save to database
      MOCK_USERS.push(newUser)

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))

      setAuthState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
      })

      return { success: true }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, error: "Ошибка регистрации" }
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const updateUser = (updates: Partial<User>) => {
    if (!authState.user) return

    const updatedUser = { ...authState.user, ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))

    setAuthState((prev) => ({
      ...prev,
      user: updatedUser,
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
