import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiClient } from "@shared/api/client"
import { AuthService } from "@shared/services/AuthService"

const authService = new AuthService(apiClient)

export function useCustomerRegister() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState("")
  const [cedula, setCedula] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!/^\d+$/.test(cedula)) {
      setMessage("La cédula debe contener únicamente números.")
      return
    }

    setLoading(true)
    setMessage("")
    try {
      await authService.register({
        usuario,
        cedula: cedula,
        fullName,
        email,
        password,
      })

      navigate("/pending-approval")
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Error al crear la cuenta.",
      )
      setLoading(false)
    }
  }

  return {
    usuario,
    setUsuario,
    cedula,
    setCedula,
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    message,
    handleRegister,
  }
}
