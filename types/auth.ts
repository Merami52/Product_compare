export interface User {
  id: string
  email: string
  name: string
  role: "buyer" | "admin"
  avatar?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  role?: "buyer" | "admin"
}
