"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { RegisterCredentials } from "@/types/auth"

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth()
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: "",
    password: "",
    name: "",
    role: "buyer",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (credentials.password !== confirmPassword) {
      setError("Пароли не совпадают")
      setIsLoading(false)
      return
    }

    // Validate password length
    if (credentials.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      setIsLoading(false)
      return
    }

    const result = await register(credentials)

    if (result.success) {
      onSuccess?.()
    } else {
      setError(result.error || "Ошибка регистрации")
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Регистрация</CardTitle>
        <CardDescription>Создайте новый аккаунт</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              type="text"
              value={credentials.name}
              onChange={(e) => setCredentials((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ваше имя"
              required
              disabled={isLoading}
            />
          </div>

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
            <Label htmlFor="role">Роль</Label>
            <Select
              value={credentials.role}
              onValueChange={(value: "buyer" | "admin") => setCredentials((prev) => ({ ...prev, role: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Покупатель</SelectItem>
                <SelectItem value="admin">Администратор</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Минимум 6 символов"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Зарегистрироваться
          </Button>
        </form>

        {onSwitchToLogin && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Уже есть аккаунт? </span>
            <Button variant="link" className="p-0 h-auto" onClick={onSwitchToLogin}>
              Войти
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
