import React from "react"
import { useNavigate } from "react-router-dom"

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6 p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-7xl font-black text-red-500">403</h1>
        <h2 className="text-2xl font-bold text-gray-900">Acceso Denegado</h2>
        <p className="text-gray-600">
          Tu rol de usuario no tiene los permisos necesarios para acceder a este
          módulo.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition-all"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}
