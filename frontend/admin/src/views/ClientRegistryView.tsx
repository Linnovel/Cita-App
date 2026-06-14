import React, { useEffect, useState } from "react"
import { AuthService, RegisterPayload } from "@shared/services/AuthService"
import { apiClient } from "@shared/api/client"
import { User } from "@shared/types/UserTypes"
import { Link } from "react-router-dom"
import { UserModal } from "../components/UserModal"

export const ClientRegistryView: React.FC = () => {
  const [clients, setClients] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<RegisterPayload>({
    usuario: "",
    cedula: "",
    fullName: "",
    email: "",
    password: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const authService = new AuthService(apiClient)

  const loadClients = async () => {
    try {
      const data = await authService.getAllUsers()
      setClients(data.filter((u) => u.role === "client"))
    } catch (error) {
      console.error("Error al cargar clientes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const handleApprove = async (userId: number) => {
    try {
      await authService.approveUser(userId)
      setClients((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, isApproved: true } : c)),
      )
    } catch (error) {
      alert("Error al aprobar usuario")
    }
  }

  const openEditModal = (client: User) => {
    setEditingUser(client)
    setFormData({
      usuario: client.usuario,
      cedula: client.cedula,
      fullName: client.fullName,
      email: client.email,
      password: "",
    })
    setError("")
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      if (editingUser) {
        await authService.updateUser(editingUser.id, formData)
        loadClients()
        setIsModalOpen(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar este paciente? Esta acción no se puede deshacer.",
      )
    )
      return
    try {
      await authService.deleteUser(id)
      setClients((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar")
    }
  }

  if (loading)
    return (
      <div className="p-10 text-center font-bold">Cargando registros...</div>
    )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
      <header>
        <h1 className="text-3xl font-black text-slate-900">
          Control de Clientes
        </h1>
        <p className="text-slate-500 font-medium">
          Monitorea y aprueba el acceso de los pacientes al sistema.
        </p>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Paciente
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Documento
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Email
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Estado
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                        {client.fullName.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {client.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                    {client.cedula}
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">
                    {client.email}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        client.isApproved
                          ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20"
                          : "bg-amber-50 text-amber-600 ring-1 ring-amber-600/20"
                      }`}
                    >
                      {client.isApproved ? "Aprobado" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-3">
                      {!client.isApproved && (
                        <button
                          onClick={() => handleApprove(client.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-tighter"
                          title="Aprobar acceso"
                        >
                          Aprobar
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(client)}
                        className="text-slate-400 hover:text-slate-900 transition-colors"
                        title="Editar información"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Eliminar paciente"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {clients.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-medium">
            No se encontraron clientes registrados.
          </div>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingUser={editingUser}
        submitting={submitting}
        error={error}
      />
    </div>
  )
}

export default ClientRegistryView
