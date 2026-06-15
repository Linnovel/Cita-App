import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@shared/hooks/useAuth"

interface NavMenuProps {
  name: string
}

export default function NavMenu({ name }: NavMenuProps) {
  const { logout, user } = useAuth()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConfirmLogout = async () => {
    setIsModalOpen(false)
    setIsDropdownOpen(false)
    await logout()
  }

  return (
    <>
      <nav className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4  border-r border-slate-700 pr-6 mr-2">
          {user?.role === "admin" ? (
            <>
              <Link
                to="/admin-dashboard"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/admin-clients"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Clientes
              </Link>
              <Link
                to="/admin-staff"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Personal
              </Link>
              <Link
                to="/auth/confirm-account"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Aprobaciones
              </Link>
            </>
          ) : user?.isApproved ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-300 hover:text-white text-sm font-bold transition-colors"
              >
                Mis Citas
              </Link>
              <Link
                to="/appointments/new"
                className="text-slate-300 hover:text-white text-sm font-bold transition-colors"
              >
                Solicitar Cita
              </Link>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-tight">{name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-slate-800 hover:ring-blue-500 transition-all"
            >
              {name.charAt(0).toUpperCase()}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200 z-40">
                <div className="px-4 py-2 border-b border-gray-50 sm:hidden">
                  <p className="text-sm font-bold text-slate-900">{name}</p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(true)
                    setIsDropdownOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 text-sm  font-bold transition-color flex items-center gap-2"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              ¿Cerrar sesión?
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Estás a punto de salir de tu cuenta. ¿Estás seguro de que deseas
              continuar?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors shadow-sm shadow-rose-200"
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
