import React from "react"

interface AppointmentFormPresenterProps {
  type: string
  setType: (type: string) => void
  observation: string
  setObservation: (observation: string) => void
  loading: boolean
  message: { text: string; isError: boolean }
  onSubmit: (e: React.FormEvent) => void
}

export const AppointmentFormPresenter: React.FC<
  AppointmentFormPresenterProps
> = ({
  type,
  setType,
  observation,
  setObservation,
  loading,
  message,
  onSubmit,
}) => {
  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Solicitar Nueva Cita
      </h2>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-lg text-sm font-medium ${
            message.isError
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Especialidad / Tipo
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="Odontología">Odontología</option>
            <option value="Cardiología">Cardiología</option>
            <option value="Trámites">Trámites</option>
            <option value="Oftalmología">Oftalmología</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Describa brevemente el motivo de su cita..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32 resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Procesando..." : "Enviar Solicitud"}
        </button>
      </form>
    </div>
  )
}
