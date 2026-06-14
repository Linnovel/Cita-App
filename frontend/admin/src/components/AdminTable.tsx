import React from "react"
import { User } from "@shared/types/UserTypes"

interface AdminTableProps {
  admins: User[]
  onEdit: (admin: User) => void
  onDelete: (id: number) => void
}

export const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  onEdit,
  onDelete,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
            Nombre
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
            Usuario
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
            Estado
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {admins.map((admin) => (
          <tr key={admin.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {admin.fullName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              @{admin.usuario}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {admin.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
              Activo
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
              <button
                onClick={() => onEdit(admin)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(admin.id)}
                className="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
