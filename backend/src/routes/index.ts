import express, { Request, Response } from "express"
import {
  approveUser,
  getUnapprovedClients,
  getMe,
  getAllAdmins,
  login,
  logout,
  register,
  registerAdmin,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/authController"
import {
  createRequest,
  getAllRequests,
  getAppointmentStats,
  getMyRequests,
  updateStatus,
} from "../controllers/appointmentController"
import { syncDatabase, testConnection } from "../services/databaseService"
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware"

const router = express.Router()

router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", route: "index" })
})

router.get("/db/test", async (_req: Request, res: Response) => {
  try {
    await testConnection()
    res.json({ status: "ok", message: "Database connection successful" })
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Database connection failed", error })
  }
})

router.get("/db/sync", async (_req: Request, res: Response) => {
  try {
    await syncDatabase()
    res.json({ status: "ok", message: "Database synchronized" })
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Database sync failed", error })
  }
})
router.post("/auth/register", register)
router.post("/auth/login", login)
router.post("/auth/logout", logout)

// Endpoint para obtener datos del usuario logueado mediante la cookie
router.get("/auth/me", authenticateToken, getMe)

// Ruta protegida: Solo administradores pueden crear otros administradores
router.post(
  "/auth/register-admin",
  authenticateToken,
  authorizeRoles(["admin"]),
  registerAdmin,
)
router.get(
  "/auth/users",
  authenticateToken,
  authorizeRoles(["admin"]),
  getAllUsers,
)
router.put(
  "/auth/users/:userId",
  authenticateToken,
  authorizeRoles(["admin"]),
  updateUser,
)
router.delete(
  "/auth/users/:userId",
  authenticateToken,
  authorizeRoles(["admin"]),
  deleteUser,
)
router.get(
  "/auth/admins",
  authenticateToken,
  authorizeRoles(["admin"]),
  getAllAdmins,
)
router.get(
  "/auth/unapproved",
  authenticateToken,
  authorizeRoles(["admin"]),
  getUnapprovedClients,
)
router.patch(
  "/auth/approve/:userId",
  authenticateToken,
  authorizeRoles(["admin"]),
  approveUser,
)

// --- Rutas de Solicitudes de Citas ---

// Cliente: Crear y ver historial propio
router.post(
  "/appointments",
  authenticateToken,
  authorizeRoles(["client"]),
  createRequest,
)
router.get(
  "/appointments/my",
  authenticateToken,
  authorizeRoles(["client"]),
  getMyRequests,
)

// Admin: Listar todas y cambiar estatus
router.get(
  "/appointments/all",
  authenticateToken,
  authorizeRoles(["admin"]),
  getAllRequests,
)
router.patch(
  "/appointments/:requestId/status",
  authenticateToken,
  authorizeRoles(["admin"]),
  updateStatus,
)
router.get(
  "/appointments/stats",
  authenticateToken,
  authorizeRoles(["admin"]),
  getAppointmentStats,
)

export default router
