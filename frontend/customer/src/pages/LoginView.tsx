import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthService } from "@shared/services/AuthService"
import { apiClient } from "@shared/api/client"
import { useAuth } from "@shared/hooks/useAuth"
import { LoginPresenter } from "./LoginPresenter"

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()
  const { checkAuth } = useAuth()

  const authService = new AuthService(apiClient)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")

    try {
      await authService.login(email, password)
      await checkAuth()
      navigate("/dashboard")
    } catch (error: any) {
      if (error.message === "Your account has not been approved yet.") {
        navigate("/pending-approval")
      } else {
        setErrorMessage(
          error.message || "Credenciales inválidas. Intente de nuevo.",
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginPresenter
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      loading={loading}
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
      onNavigateRegister={() => navigate("/auth/register")}
    />
  )
}
