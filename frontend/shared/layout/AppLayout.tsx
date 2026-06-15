import React from "react"
import NavMenu from "@shared/components/NavMenu"

import { Link, Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@shared/hooks/useAuth"

export function AppLayout() {
  const { isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">
            Sincronizando sesión...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={"/auth/login"} />
  }

  if (
    user.role === "client" &&
    !user.isApproved &&
    location.pathname !== "/pending-approval"
  ) {
    return <Navigate to="/pending-approval" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group gap-3 transition-transform active:scale-95">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
                <svg
                  className="w-6 h-6 text-white"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tighter">
                CitaApp
              </span>
            </div>
            <NavMenu name={user.fullName || user.email} />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} CitaApp - Gestión de Citas Médicas
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
