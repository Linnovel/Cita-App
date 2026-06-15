import React from "react"
import { RegisterPayload } from "@shared/services/AuthService"
import { User } from "@shared/types/UserTypes"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  formData: RegisterPayload
  setFormData: React.Dispatch<React.SetStateAction<RegisterPayload>>
  editingUser: User | null
  submitting: boolean
  error: string
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingUser,
  submitting,
  error,
}) => {
  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isCedulaInvalid =
    formData.cedula !== "" && !/^\d+$/.test(String(formData.cedula))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 md:p-10">
          <header className="mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {editingUser ? "Editar Paciente" : "Nuevo Paciente"}
            </h3>
            <p className="text-slate-500 font-medium mt-1">
              {editingUser
                ? "Actualiza la información personal del registro clínico."
                : "Registra un nuevo cliente manualmente en el sistema."}
            </p>
          </header>

          {error && (
            <div className="mb-6 bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Cédula / ID
                </label>
                <input
                  type="number"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:ring-2 outline-none transition-all font-bold text-slate-700 ${
                    isCedulaInvalid
                      ? "border-rose-500 focus:ring-rose-500 shadow-sm shadow-rose-100"
                      : "border-slate-200 focus:ring-blue-600"
                  }`}
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  required
                />
                {isCedulaInvalid && (
                  <p className="text-[10px] text-rose-500 font-black uppercase tracking-wider ml-1 animate-in slide-in-from-top-1">
                    Solo se permiten números sin puntos ni guiones
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-700"
                required
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-4 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all disabled:bg-slate-300 transform active:scale-95"
              >
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
