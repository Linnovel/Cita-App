import React, { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@shared/components/ProtectedRoute"
import { AppLayout } from "@shared/layout/AppLayout"
import { AuthProvider } from "@shared/contexts/AuthContext"

const CustomerPortalPage = lazy(() =>
  import("./pages/CustomerPortalPage").then((m) => ({
    default: m.CustomerPortalPage,
  })),
)
const LoginView = lazy(() =>
  import("./pages/LoginView").then((m) => ({ default: m.LoginView })),
)
const PendingApprovalView = lazy(() =>
  import("./pages/PendingApprovalView").then((m) => ({
    default: m.PendingApprovalView,
  })),
)
const AppointmentForm = lazy(() =>
  import("./components/AppointmentForm").then((m) => ({
    default: m.AppointmentForm,
  })),
)
const AppointmentHistory = lazy(() =>
  import("./components/AppointmentHistory").then((m) => ({
    default: m.AppointmentHistory,
  })),
)
const UnauthorizedPage = lazy(() =>
  import("@shared/pages/UnauthorizedPage").then((m) => ({
    default: m.UnauthorizedPage,
  })),
)

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="p-10 text-center font-bold">
              Cargando CitaApp...
            </div>
          }
        >
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginView />} />
            <Route path="/auth/register" element={<CustomerPortalPage />} />
            <Route path="/pending-approval" element={<PendingApprovalView />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Rutas Privadas (Solo Clientes Aprobados) */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<AppointmentHistory />} />
              <Route path="/appointments/new" element={<AppointmentForm />} />
              <Route
                path="/appointments/history"
                element={<AppointmentHistory />}
              />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
