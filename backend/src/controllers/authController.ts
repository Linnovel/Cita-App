import { Request, Response } from "express"
import User from "../models/User"
import {
  comparePassword,
  createToken,
  hashPassword,
} from "../services/authService"
import { AuthenticatedRequest } from "../middlewares/authMiddleware"

interface RegisterBody {
  usuario?: string
  cedula?: string
  fullName?: string
  email?: string
  password?: string
  role?: "admin" | "client"
  isApproved?: boolean
}

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { usuario, cedula, fullName, email, password } =
      req.body as RegisterBody

    if (!fullName || !email || !password || !usuario || !cedula) {
      return res.status(400).json({
        message:
          "All fields (usuario, cedula, fullName, email, password) are required.",
      })
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Verifique la información e intente nuevamente" })
    }

    const existingUsername = await User.findOne({ where: { usuario } })
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken." })
    }

    const existingID = await User.findOne({
      where: { cedula: cedula },
    })
    if (existingID) {
      return res
        .status(409)
        .json({ message: "Verifique la información e intente nuevamente" })
    }

    const hashedPassword = await hashPassword(password)

    const user = await User.create({
      usuario,
      cedula,
      fullName,
      email,
      password: hashedPassword,
      role: "client",
      isApproved: false,
    })

    // Generamos token y cookie para login automático tras registro
    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    const appContext = req.headers["x-app-context"] || "customer"
    const cookieName = appContext === "admin" ? "admin_token" : "customer_token"

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    })

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user.id,
        usuario: user.usuario,
        cedula: user.cedula,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    })
  } catch (error) {
    console.error("Error en el registro:", error)
    return res.status(500).json({
      message: "Internal server error during registration.",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required." })
  }

  const user = await User.findOne({ where: { email } })

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." })
  }

  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials." })
  }

  const token = createToken({ id: user.id, email: user.email, role: user.role })

  // Identificamos el contexto desde el header enviado por el frontend
  const appContext = req.headers["x-app-context"] || "customer"
  const cookieName = appContext === "admin" ? "admin_token" : "customer_token"

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 día
  })

  return res.status(200).json({
    message: "Login successful.",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    },
  })
}

export const logout = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  const appContext = _req.headers["x-app-context"]
  const cookieName = appContext === "admin" ? "admin_token" : "customer_token"

  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })

  return res.status(200).json({ message: "Logout successful." })
}

export const approveUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userId } = req.params

    // 1. Buscar al usuario
    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    if (user.role === "admin") {
      return res
        .status(400)
        .json({ message: "Admin accounts do not require approval." })
    }

    if (user.isApproved) {
      return res.status(400).json({ message: "User is already approved." })
    }

    // 2. Aprobar al usuario
    user.isApproved = true
    await user.save()

    return res.status(200).json({
      message: `User ${user.fullName} has been approved successfully.`,
      user: {
        id: user.id,
        isApproved: user.isApproved,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: "Error approving user.", error })
  }
}

export const getUnapprovedClients = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const users = await User.findAll({
      where: {
        role: "client",
        isApproved: false,
      },
      attributes: { exclude: ["password"] }, // Excluimos la contraseña por seguridad
    })

    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching unapproved users.",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const registerAdmin = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { usuario, cedula, fullName, email, password } =
      req.body as RegisterBody

    if (!fullName || !email || !password || !usuario || !cedula) {
      return res.status(400).json({
        message: "All fields are required to register an admin.",
      })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." })
    }

    const hashedPassword = await hashPassword(password)

    const user = await User.create({
      usuario,
      cedula,
      fullName,
      email,
      password: hashedPassword,
      role: "admin",
      isApproved: true,
    })

    return res.status(201).json({
      message: "Admin registered successfully.",
      user: { id: user.id, email: user.email, role: user.role },
    })
  } catch (error) {
    return res.status(500).json({ message: "Error registering admin.", error })
  }
}

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.id

    if (userId === undefined) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    })

    if (!user) return res.status(404).json({ message: "User not found" })

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user info", error })
  }
}

export const getAllAdmins = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const admins = await User.findAll({
      where: { role: "admin" },
      attributes: { exclude: ["password"] },
    })

    return res.status(200).json(admins)
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener lista de administradores.", error })
  }
}

/**
 * Obtiene todos los usuarios registrados (Control de Registros)
 */
export const getAllUsers = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    })
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener usuarios", error })
  }
}

/**
 * Actualiza los datos de un usuario (Update del CRUD)
 */
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userId } = req.params
    const { fullName, email, usuario, cedula } = req.body
    const user = await User.findByPk(userId)

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" })

    await user.update({ fullName, email, usuario, cedula })
    return res.status(200).json(user)
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar usuario", error })
  }
}

/**
 * Elimina un usuario (Delete del CRUD)
 */
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userId } = req.params
    const user = await User.findByPk(userId)
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" })

    await user.destroy()
    return res.status(200).json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar usuario", error })
  }
}
