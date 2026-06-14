import React, { useEffect, useState } from "react"
import { AuthService } from "@shared/services/AuthService"
import { apiClient } from "@shared/api/client"

export const AppointmentHistory: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const authService = new AuthService(apiClient)

  useEffect(() => {
    authService
      .getMyAppointments()
      .then(setRequests)
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return <div className="p-4 text-center">Cargando trámites...</div>

  return (
    <section className="mt-8 p-4 bg-white rounded-xl shadow-sm border">
      <header className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Historial de Solicitudes
        </h3>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 hidden md:table-cell">Observación</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {req.type}
                </td>
                <td className="px-4 py-3">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      req.status === "Nuevo"
                        ? "bg-blue-100 text-blue-800"
                        : req.status === "Completado"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell truncate max-w-xs">
                  {req.observation}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center">
                  No posees trámites históricos aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
