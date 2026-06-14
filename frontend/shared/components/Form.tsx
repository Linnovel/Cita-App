// components/Form.tsx
import React from "react"

interface FormProps {
  children: React.ReactNode
  onSubmit: (event: React.FormEvent) => void
  loading: boolean
  buttonText: string
}

export default function Form({
  children,
  onSubmit,
  loading,
  buttonText,
}: FormProps) {
  return (
    <form className="stack" onSubmit={onSubmit}>
      {children}
      <button type="submit" disabled={loading}>
        {loading ? "Procesando..." : buttonText}
      </button>
    </form>
  )
}
