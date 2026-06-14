import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UserAttributes } from "../models/User"

// Define una interfaz personalizada para el objeto Request de Express
// Esto nos permite añadir la propiedad 'user' al objeto Request de forma segura.
export interface AuthenticatedRequest extends Request {
  user?: Pick<UserAttributes, "id" | "email" | "role">
  cookies: { [key: string]: string }
}

/**
 * Middleware para autenticar un token JWT.
 * Verifica la existencia y validez del token en las cookies de la petición.
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Asumiendo que usas cookies para la sesión y el token se llama 'token'
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. No hay token." })
  }

  // Asegurarse de que JWT_SECRET está definido en las variables de entorno
  if (!process.env.JWT_SECRET) {
    console.error(
      "Error de configuración del servidor: JWT_SECRET no está definido.",
    )
    return res
      .status(500)
      .json({ message: "Error de configuración del servidor." })
  }

  try {
    // Verifica el token y decodifica el payload. El payload debe coincidir con el tipo esperado.
    const verified = jwt.verify(token, process.env.JWT_SECRET) as Pick<
      UserAttributes,
      "id" | "email" | "role"
    >
    ;(req as AuthenticatedRequest).user = verified // Adjunta la información del usuario a la petición
    next() // Pasa al siguiente middleware o ruta
  } catch (err) {
    console.error("Fallo la verificación del token:", err)
    return res.status(403).json({ message: "Token inválido o expirado." })
  }
}

/**
 * Middleware para autorizar roles.
 * Retorna una función que verifica si el usuario autenticado tiene alguno de los roles permitidos.
 */
export const authorizeRoles = (roles: Array<UserAttributes["role"]>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as AuthenticatedRequest).user?.role

    // Si no hay rol de usuario, o el rol no está en la lista de roles permitidos
    if (!userRole || !roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos suficientes." })
    }
    next() // Pasa al siguiente middleware o ruta
  }
}
