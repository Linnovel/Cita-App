import dotenv from "dotenv"

dotenv.config()

import express, { Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import routes from "./routes"
import { syncDatabase } from "./services/databaseService"
import { ensureDefaultAdminUser } from "./services/authService"

const app = express()
const PORT = Number(process.env.PORT || 3000)
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
  process.env.FRONTEND_ADMIN_URL,
].filter(Boolean) as string[]

app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (como Postman o el propio servidor)
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      // En lugar de lanzar un Error(), pasamos 'false' para que falle el CORS en el navegador
      // pero que el backend no devuelva un 500.
      console.warn(`[CORS] Bloqueado origin no permitido: ${origin}`)
      callback(null, false)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use("/api", routes)

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "citaapp-backend" })
})

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "CitaApp backend API is running." })
})

const bootstrap = async (): Promise<void> => {
  try {
    await syncDatabase()
    await ensureDefaultAdminUser()
    console.log("Database initialized and default admin user is ready.")
  } catch (error) {
    console.error("Startup bootstrap failed:", error)
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on http://0.0.0.0:${PORT}`)
  })
}

void bootstrap()
