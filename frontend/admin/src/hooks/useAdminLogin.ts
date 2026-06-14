import React, { useState } from "react"
import { useAuth } from "@shared/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { AuthService } from "@shared/services/AuthService"
import { apiClient } from "@shared/api/client"

export function useAdminLogin() {
  const [email, setEmail] = useState("admin@citaapp.com")
  const [password, setPassword] = useState("admin123*")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { checkAuth } = useAuth()
  const navigate = useNavigate()
  const authService = new AuthService(apiClient)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage("")
    setIsLoading(true)

    try {
      const response = await authService.login(email, password)
      await checkAuth()
      setMessage(
        `Acceso autorizado como ${response.user.role}. Redirigiendo...`,
      )
      navigate("/admin-dashboard")
    } catch (err: any) {
      setMessage(err.message || "Error desconocido al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading,
    message,
  }
}
