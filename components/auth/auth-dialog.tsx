"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultMode?: "login" | "register"
}

export function AuthDialog({ open, onOpenChange, defaultMode = "login" }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode)

  const handleSuccess = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Вход в систему" : "Регистрация"}</DialogTitle>
        </DialogHeader>
        {mode === "login" ? (
          <LoginForm onSuccess={handleSuccess} onSwitchToRegister={() => setMode("register")} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={() => setMode("login")} />
        )}
      </DialogContent>
    </Dialog>
  )
}
