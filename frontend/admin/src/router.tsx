import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@shared/layout/AppLayout"
import AuthLayout from "@shared/layout/AuthLayout"
import { AuthProvider } from "@shared/contexts/AuthContext"
import { ProtectedRoute } from "@shared/components/ProtectedRoute"

// Lazy loading para optimizar rendimiento
const AdminLoginPage = lazy(() =>
  import("./pages/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })),
)
const DashboardView = lazy(() => import("./views/DashboardView"))
const ClientRegistryView = lazy(() => import("./views/ClientRegistryView"))
const ConfirmAccountView = lazy(() => import("./views/ConfirmCustomerView"))
const AdminManagement = lazy(() =>
  import("./components/AdminManagement").then((m) => ({
    default: m.AdminManagement,
  })),
)
const UnauthorizedPage = lazy(() =>
  import("@shared/pages/UnauthorizedPage").then((m) => ({
    default: m.UnauthorizedPage,
  })),
)

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="p-10 text-center font-bold">Cargando Panel...</div>
          }
        >
          <Routes>
            {/* Rutas Públicas (Envueltas en AuthLayout) */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<AdminLoginPage />} />
              <Route path="/auth/register" element={<AdminLoginPage />} />
            </Route>

            {/* Rutas Privadas (Solo Administradores) */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin-dashboard" element={<DashboardView />} />
              <Route path="/admin-clients" element={<ClientRegistryView />} />
              <Route path="/admin-staff" element={<AdminManagement />} />
              <Route
                path="/auth/confirm-account"
                element={<ConfirmAccountView />}
              />
            </Route>
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
