"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar, Shield, ShoppingCart, Edit } from "lucide-react"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const { user } = useAuth()

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleIcon = (role: string) => {
    return role === "admin" ? <Shield className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />
  }

  const getRoleLabel = (role: string) => {
    return role === "admin" ? "Администратор" : "Покупатель"
  }

  const getRoleColor = (role: string) => {
    return role === "admin" ? "destructive" : "secondary"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Профиль пользователя</h1>
              <p className="text-muted-foreground">Управление вашим аккаунтом</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  {user.name}
                  <Badge variant={getRoleColor(user.role)} className="text-xs">
                    {getRoleIcon(user.role)}
                    <span className="ml-1">{getRoleLabel(user.role)}</span>
                  </Badge>
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Редактировать профиль
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Информация об аккаунте</CardTitle>
                <CardDescription>Основные данные вашего профиля</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Полное имя</p>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email адрес</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getRoleIcon(user.role)}
                  <div>
                    <p className="text-sm font-medium">Роль</p>
                    <p className="text-sm text-muted-foreground">{getRoleLabel(user.role)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Дата регистрации</p>
                    <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role-specific content */}
            {user.role === "admin" && (
              <Card>
                <CardHeader>
                  <CardTitle>Права администратора</CardTitle>
                  <CardDescription>Доступные функции для администраторов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Добавление новых товаров</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Редактирование товаров</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Управление категориями</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Просмотр аналитики</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {user.role === "buyer" && (
              <Card>
                <CardHeader>
                  <CardTitle>Возможности покупателя</CardTitle>
                  <CardDescription>Доступные функции для покупателей</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Просмотр каталога товаров</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Сравнение товаров</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Добавление в избранное</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Написание отзывов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Экспорт данных сравнения</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
