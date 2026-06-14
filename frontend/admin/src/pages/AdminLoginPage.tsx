import Form from "../../../shared/components/Form"
import { useAdminLogin } from "../hooks/useAdminLogin"

export function AdminLoginPage() {
  const {
    email,
    handleSubmit,
    isLoading,
    message,
    password,
    setEmail,
    setPassword,
  } = useAdminLogin()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decoración de fondo para evitar que se vea "roto" o vacío */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full space-y-8 p-10 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-slate-800 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center text-purple-400 mb-4 shadow-inner">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.04l.539-.807.032-.054a10.002 10.002 0 01-.264-10.323l.538-.808m13.141 8.192a10.002 10.002 0 01-11.83 4.218m11.83-4.218a10.002 10.002 0 00-1.83-12.184m1.83 12.184l-.539.807-.032.054a10.002 10.002 0 003.04 12.02m-5.842-12.02a3.333 3.333 0 013.44 3.041m0 0l.539.808a10.002 10.002 0 01-3.44 3.04m0-6.081l-.539.808a10.002 10.002 0 003.44 3.041m-3.44 3.041a3.333 3.333 0 01-3.44-3.041"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white">Staff Login</h1>
          <p className="mt-2 text-slate-400 font-medium  italic">
            Consola de Administración de Citas
          </p>
        </div>

        {message && (
          <div className="bg-slate-700/50 text-amber-400 p-4 rounded-2xl text-sm font-bold border border-slate-600 text-center animate-pulse">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="Admin Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-[0.98] disabled:bg-slate-600 disabled:text-slate-400"
          >
            {isLoading ? "Autenticando..." : "Acceder al Panel"}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
            Uso Restringido a Personal Autorizado
          </p>
        </div>
      </div>
    </div>
  )
}
