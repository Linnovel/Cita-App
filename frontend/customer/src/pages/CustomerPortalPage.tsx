import { useCustomerRegister } from "../hooks/useCustomerRegister"
import React from "react"
import Form from "../../../shared/components/Form"

export function CustomerPortalPage() {
  const {
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
  } = useCustomerRegister()

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Portal del paciente</p>
        <h1>CitaApp Customer</h1>
      </section>

      <section className="card form-card">
        <h2>Registro de paciente</h2>

        <Form
          onSubmit={handleRegister}
          loading={loading}
          buttonText="Crear cuenta"
        >
          <label>
            Usuario
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </label>
          <label>
            Cédula de Identidad
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
            />
          </label>
          <label>
            Nombre completo
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>
          <label>
            Correo Electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </Form>

        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  )
}
