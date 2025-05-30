"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, Shield, ShoppingCart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AuthDialog } from "./auth-dialog"
import Link from "next/link"

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  if (!isAuthenticated || !user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setAuthMode("login")
              setAuthDialogOpen(true)
            }}
          >
            Войти
          </Button>
          <Button
            onClick={() => {
              setAuthMode("register")
              setAuthDialogOpen(true)
            }}
          >
            Регистрация
          </Button>
        </div>
        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} defaultMode={authMode} />
      </>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleIcon = (role: string) => {
    return role === "admin" ? <Shield className="h-3 w-3" /> : <ShoppingCart className="h-3 w-3" />
  }

  const getRoleLabel = (role: string) => {
    return role === "admin" ? "Администратор" : "Покупатель"
  }

  const getRoleColor = (role: string) => {
    return role === "admin" ? "destructive" : "secondary"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <Badge variant={getRoleColor(user.role)} className="text-xs">
                {getRoleIcon(user.role)}
                <span className="ml-1">{getRoleLabel(user.role)}</span>
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Профиль</span>
          </Link>
        </DropdownMenuItem>
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Админ панель</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Настройки</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
