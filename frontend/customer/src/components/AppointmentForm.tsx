import React, { useState } from "react"
import { AuthService } from "@shared/services/AuthService"
import { apiClient } from "@shared/api/client"
import { AppointmentFormPresenter } from "./AppointmentFormPresenter"

export const AppointmentForm: React.FC = () => {
  const [type, setType] = useState("Odontología")
  const [observation, setObservation] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", isError: false })

  const authService = new AuthService(apiClient)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: "", isError: false })

    try {
      await authService.createAppointment(type, observation)
      setMessage({
        text: "Solicitud de cita creada con éxito.",
        isError: false,
      })
      setObservation("")
    } catch (error: any) {
      setMessage({
        text: error.message || "Error al procesar la solicitud.",
        isError: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppointmentFormPresenter
      type={type}
      setType={setType}
      observation={observation}
      setObservation={setObservation}
      loading={loading}
      message={message}
      onSubmit={handleSubmit}
    />
  )
}
