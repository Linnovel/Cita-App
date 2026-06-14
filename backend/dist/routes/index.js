"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const appointmentController_1 = require("../controllers/appointmentController");
const databaseService_1 = require("../services/databaseService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/health", (_req, res) => {
    res.json({ status: "ok", route: "index" });
});
router.get("/db/test", async (_req, res) => {
    try {
        await (0, databaseService_1.testConnection)();
        res.json({ status: "ok", message: "Database connection successful" });
    }
    catch (error) {
        res
            .status(500)
            .json({ status: "error", message: "Database connection failed", error });
    }
});
router.get("/db/sync", async (_req, res) => {
    try {
        await (0, databaseService_1.syncDatabase)();
        res.json({ status: "ok", message: "Database synchronized" });
    }
    catch (error) {
        res
            .status(500)
            .json({ status: "error", message: "Database sync failed", error });
    }
});
router.post("/auth/register", authController_1.register);
router.post("/auth/login", authController_1.login);
router.post("/auth/logout", authController_1.logout);
// Endpoint para obtener datos del usuario logueado mediante la cookie
router.get("/auth/me", authMiddleware_1.authenticateToken, authController_1.getMe);
// Ruta protegida: Solo administradores pueden crear otros administradores
router.post("/auth/register-admin", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), authController_1.registerAdmin);
router.get("/auth/users", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), authController_1.getAllUsers);
router.put("/auth/users/:userId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), authController_1.updateUser);
router.delete("/auth/users/:userId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), authController_1.deleteUser);
router.get("/auth/admins", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), authController_1.getAllAdmins);
router.get("/auth/unapproved", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), authController_1.getUnapprovedClients);
router.patch("/auth/approve/:userId", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), authController_1.approveUser);
// --- Rutas de Solicitudes de Citas ---
// Cliente: Crear y ver historial propio
router.post("/appointments", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["client"]), appointmentController_1.createRequest);
router.get("/appointments/my", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["client"]), appointmentController_1.getMyRequests);
// Admin: Listar todas y cambiar estatus
router.get("/appointments/all", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), appointmentController_1.getAllRequests);
router.patch("/appointments/:requestId/status", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), appointmentController_1.updateStatus);
router.get("/appointments/stats", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), appointmentController_1.getAppointmentStats);
exports.default = router;
