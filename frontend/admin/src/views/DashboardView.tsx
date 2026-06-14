import React, { useEffect, useState } from "react"
import { AppointmentTable } from "../components/AppointmentTable"
import { AppointmentStatsChart } from "../components/AppointmentStatsChart"
import { AuthService } from "@shared/services/AuthService"
import { apiClient } from "@shared/api/client"
import { Link } from "react-router-dom"

export default function DashboardView() {
  const [stats, setStats] = useState<any>(null)
  const authService = new AuthService(apiClient)

  const fetchStats = async () => {
    try {
      const data = await authService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error("Error al cargar estadísticas")
    }
  }

  useEffect(() => {
    fetchStats()
    // Sincronización automática cada 30 segundos (Polling)
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Encabezado Semántico */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Panel de Control
          </h1>
          <p className="text-slate-500 font-medium">
            Visualización de estadísticas y control de solicitudes.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Módulo Clientes */}
        <Link
          to="/admin-clients"
          className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              GESTIÓN CLIENTES
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase">
            Usuarios Totales
          </p>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {stats?.totalClients || "--"}
          </p>
        </Link>

        <Link
          to="/auth/confirm-account"
          className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
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
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              APROBACIONES
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase">
            Clientes Pendientes
          </p>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {/* Usamos el dato real del controlador para saber cuántos clientes faltan por aprobar */}
            {stats?.totalClientsUnapproved || "0"}
          </p>
        </Link>

        {/* Módulo Éxito (Citas Completadas) */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              MÉTRICAS ÉXITO
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase">
            Citas Finalizadas
          </p>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {stats ? stats.totalAppointments - stats.pendingAppointments : "--"}
          </p>
        </div>
      </div>

      {/* Sección Inferior: Gráficos y Tabla de Control (Módulos 1 y 3) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <section className="xl:col-span-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Distribución de Solicitudes
          </h2>
          <AppointmentStatsChart />
        </section>

        <section className="xl:col-span-8">
          {/* Este componente gestiona el "Control de Solicitudes Generales" y el "Cambio de estatus" */}
          <AppointmentTable />
        </section>
      </div>

      {/* Footer de navegación rápida */}
      <div className="flex justify-center pt-4">
        <Link
          to="/admin-staff"
          className="text-slate-400 hover:text-purple-600 font-bold text-sm transition-colors uppercase tracking-widest"
        >
          Ir a Gestión de Administradores →
        </Link>
      </div>
    </div>
  )
}
