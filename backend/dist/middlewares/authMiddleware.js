"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Middleware para autenticar un token JWT.
 * Verifica la existencia y validez del token en las cookies de la petición.
 */
const authenticateToken = (req, res, next) => {
    // Asumiendo que usas cookies para la sesión y el token se llama 'token'
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }
    // Asegurarse de que JWT_SECRET está definido en las variables de entorno
    if (!process.env.JWT_SECRET) {
        console.error("Error de configuración del servidor: JWT_SECRET no está definido.");
        return res
            .status(500)
            .json({ message: "Error de configuración del servidor." });
    }
    try {
        // Verifica el token y decodifica el payload. El payload debe coincidir con el tipo esperado.
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Adjunta la información del usuario a la petición
        next(); // Pasa al siguiente middleware o ruta
    }
    catch (err) {
        console.error("Fallo la verificación del token:", err);
        return res.status(403).json({ message: "Token inválido o expirado." });
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Middleware para autorizar roles.
 * Retorna una función que verifica si el usuario autenticado tiene alguno de los roles permitidos.
 */
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        // Si no hay rol de usuario, o el rol no está en la lista de roles permitidos
        if (!userRole || !roles.includes(userRole)) {
            return res
                .status(403)
                .json({ message: "No tienes permisos suficientes." });
        }
        next(); // Pasa al siguiente middleware o ruta
    };
};
exports.authorizeRoles = authorizeRoles;
