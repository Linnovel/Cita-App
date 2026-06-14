"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const databaseService_1 = require("./services/databaseService");
const authService_1 = require("./services/authService");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 3000);
const allowedOrigins = [
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    process.env.FRONTEND_ADMIN_URL,
].filter(Boolean);
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Permitir peticiones sin origin (como Postman o el propio servidor)
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        // En lugar de lanzar un Error(), pasamos 'false' para que falle el CORS en el navegador
        // pero que el backend no devuelva un 500.
        console.warn(`[CORS] Bloqueado origin no permitido: ${origin}`);
        callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/api", routes_1.default);
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "citaapp-backend" });
});
app.get("/", (_req, res) => {
    res.json({ message: "CitaApp backend API is running." });
});
const bootstrap = async () => {
    try {
        await (0, databaseService_1.syncDatabase)();
        await (0, authService_1.ensureDefaultAdminUser)();
        console.log("Database initialized and default admin user is ready.");
    }
    catch (error) {
        console.error("Startup bootstrap failed:", error);
    }
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Backend running on http://0.0.0.0:${PORT}`);
    });
};
void bootstrap();
