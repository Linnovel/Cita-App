import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UserAttributes } from "../models/User"

export interface AuthenticatedRequest extends Request {
  user?: Pick<UserAttributes, "id" | "email" | "role">
  cookies: { [key: string]: string }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const appContext = req.headers["x-app-context"]
  const cookieName = appContext === "admin" ? "admin_token" : "customer_token"

  const token = req.cookies?.[cookieName]

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. No hay token." })
  }

  if (!process.env.JWT_SECRET) {
    console.error(
      "Error de configuración del servidor: JWT_SECRET no está definido.",
    )
    return res
      .status(500)
      .json({ message: "Error de configuración del servidor." })
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET) as Pick<
      UserAttributes,
      "id" | "email" | "role"
    >
    ;(req as AuthenticatedRequest).user = verified
    next()
  } catch (err) {
    console.error("Fallo la verificación del token:", err)
    return res.status(403).json({ message: "Token inválido o expirado." })
  }
}

export const authorizeRoles = (roles: Array<UserAttributes["role"]>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as AuthenticatedRequest).user?.role

    if (!userRole || !roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos suficientes." })
    }
    next()
  }
}
