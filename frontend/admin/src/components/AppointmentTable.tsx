import React, { useEffect, useState } from "react"
import { AuthService } from "@shared/services/AuthService"
import { apiClient } from "@shared/api/client"

export const AppointmentTable: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const authService = new AuthService(apiClient)

  const loadData = async () => {
    try {
      const data = await authService.getAllAppointments()
      setAppointments(data)
    } catch (error) {
      console.error("Error cargando citas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await authService.updateAppointmentStatus(id, newStatus)
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app,
        ),
      )
    } catch (error) {
      alert("Error al actualizar el estado de la cita")
    }
  }

  if (loading)
    return <div className="text-center py-10">Cargando solicitudes...</div>

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-white">
        <h3 className="text-xl font-bold text-slate-800">
          Control de Solicitudes Generales
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                Paciente / Cédula
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                Especialidad
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                Observación
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                Fecha
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                Estado
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                Gestión
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {appointments.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-slate-50/50 transition-all group"
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">
                    {app.user?.fullName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {app.user?.cedula}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-slate-100 text-slate-800">
                    {app.type}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-gray-600 max-w-xs truncate font-medium">
                  {app.observation}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  {/* Mejorar visibilidad de badges */}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                      app.status === "Nuevo"
                        ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                        : app.status === "Procesando"
                          ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                          : app.status === "Completado"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                            : "bg-rose-50 text-rose-700 ring-rose-600/20"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse"></span>
                    {app.status}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm font-medium">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-2.5 outline-none transition-all cursor-pointer hover:bg-slate-100"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Procesando">Procesando</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
