import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@shared/hooks/useAuth"

export const PendingApprovalView: React.FC = () => {
  const { checkAuth, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Si el usuario ya está aprobado mientras tiene esta vista abierta, redirigir
    if (user?.isApproved) {
      navigate("/dashboard")
    }

    // Verificar el estado de la cuenta automáticamente cada 15 segundos
    const interval = setInterval(async () => {
      await checkAuth()
    }, 15000)

    return () => clearInterval(interval)
  }, [user, navigate, checkAuth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-white">
        <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4 animate-pulse">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">
            ¡Registro Exitoso!
          </h1>
          <h2 className="text-xl font-bold text-amber-600">
            Tu cuenta está en revisión
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Un administrador debe aprobar tu acceso para que puedas comenzar a
            gestionar tus citas médicas. Recibirás una notificación una vez seas
            aprobado.
          </p>
        </div>
        <div className="pt-6 space-y-4">
          <Link
            to="/login"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-100"
          >
            Probar Inicio de Sesión
          </Link>
          <Link
            to="/"
            className="inline-block w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
