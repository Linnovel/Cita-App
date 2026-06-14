import React, { useEffect, useState } from "react"
import { AuthService, RegisterPayload } from "@shared/services/AuthService"
import { apiClient } from "@shared/api/client"
import { User } from "@shared/types/UserTypes"
import { AdminTable } from "./AdminTable"
import { AdminModal } from "./AdminModal"
import { Link } from "react-router-dom"

export const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null)
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

  const loadAdmins = async () => {
    try {
      const data = await authService.getAllAdmins()
      setAdmins(data)
    } catch (error) {
      console.error("Error cargando administradores:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  const openCreateModal = () => {
    setEditingAdmin(null)
    setFormData({
      usuario: "",
      cedula: "",
      fullName: "",
      email: "",
      password: "",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (admin: User) => {
    setEditingAdmin(admin)
    setFormData({
      usuario: admin.usuario,
      cedula: admin.cedula,
      fullName: admin.fullName,
      email: admin.email,
      password: "",
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      if (editingAdmin) {
        await authService.updateUser(editingAdmin.id, formData)
      } else {
        await authService.registerAdmin(formData)
      }
      setIsModalOpen(false)
      setFormData({
        usuario: "",
        cedula: "",
        fullName: "",
        email: "",
        password: "",
      })
      loadAdmins()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al procesar la solicitud",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este administrador?")) return
    try {
      await authService.deleteUser(id)
      loadAdmins()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar")
    }
  }

  if (loading)
    return (
      <div className="p-10 text-center font-bold animate-pulse text-slate-400">
        Cargando personal...
      </div>
    )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Gestión de Staff
          </h2>
          <p className="text-slate-500 font-medium">
            Administra los accesos y perfiles del personal administrativo.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center gap-2 w-fit"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nuevo Administrador
        </button>
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingAdmin={editingAdmin}
        submitting={submitting}
        error={error}
      />

      <AdminTable
        admins={admins}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />
    </div>
  )
}
