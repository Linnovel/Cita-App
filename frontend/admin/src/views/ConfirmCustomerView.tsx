import React, { useEffect, useState } from "react"
import { AuthService } from "@shared/services/AuthService"
import { apiClient } from "@shared/api/client"
import { User } from "@shared/types/UserTypes"
import { Link } from "react-router-dom"

export default function ConfirmCustomerView() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const authService = new AuthService(apiClient)

  const loadPending = async () => {
    try {
      const data = await authService.getUnapprovedClients()
      setPendingUsers(data)
    } catch (error) {
      console.error("Error al cargar pendientes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPending()
  }, [])

  const handleApprove = async (userId: number) => {
    try {
      await authService.approveUser(userId)
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (error) {
      alert("Error al aprobar")
    }
  }

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-slate-400">
        Cargando aprobaciones...
      </div>
    )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <Link
          to="/admin-dashboard"
          className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al Panel
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Aprobaciones Pendientes
        </h1>
        <p className="text-slate-500 font-medium italic">
          Clientes esperando acceso al sistema.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4 font-black">
                {user.fullName.charAt(0)}
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                {user.fullName}
              </h3>
              <p className="text-sm text-slate-500 font-medium mb-1">
                {user.email}
              </p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
                ID: {user.cedula}
              </p>

              <button
                onClick={() => handleApprove(user.id)}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-100"
              >
                Aprobar Cliente
              </button>
            </div>
          </div>
        ))}
      </div>

      {pendingUsers.length === 0 && (
        <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-slate-400 font-bold text-lg">
            No hay clientes pendientes de aprobación
          </p>
          <p className="text-slate-400 text-sm">Todo está al día.</p>
        </div>
      )}
    </div>
  )
}
