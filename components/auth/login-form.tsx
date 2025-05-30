"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { LoginCredentials } from "@/types/auth"

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(credentials)

    if (result.success) {
      onSuccess?.()
    } else {
      setError(result.error || "Ошибка входа в систему")
    }

    setIsLoading(false)
  }

  const handleDemoLogin = async (role: "admin" | "buyer") => {
    setIsLoading(true)
    setError("")

    const demoCredentials = {
      email: role === "admin" ? "admin@example.com" : "buyer@example.com",
      password: "password",
    }

    const result = await login(demoCredentials)

    if (result.success) {
      onSuccess?.()
    } else {
      setError(result.error || "Ошибка входа в систему")
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Вход в систему</CardTitle>
        <CardDescription>Введите ваши данные для входа</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Введите пароль"
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Войти
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Или попробуйте демо</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => handleDemoLogin("buyer")} disabled={isLoading}>
            Покупатель
          </Button>
          <Button variant="outline" onClick={() => handleDemoLogin("admin")} disabled={isLoading}>
            Администратор
          </Button>
        </div>

        {onSwitchToRegister && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Нет аккаунта? </span>
            <Button variant="link" className="p-0 h-auto" onClick={onSwitchToRegister}>
              Зарегистрироваться
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Демо данные:</strong>
          </p>
          <p>Покупатель: buyer@example.com / password</p>
          <p>Администратор: admin@example.com / password</p>
        </div>
      </CardContent>
    </Card>
  )
}
