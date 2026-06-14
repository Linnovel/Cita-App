"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Middleware para autenticar un token JWT almacenado en cookies.
 * Verifica la existencia y validez del token.
 */
const authenticateToken = (req, res, next) => {
    // Hacemos cast a AuthenticatedRequest para acceder a las cookies de forma segura en TS
    const authReq = req;
    const token = authReq.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }
    if (!process.env.JWT_SECRET) {
        console.error("Error de configuración del servidor: JWT_SECRET no definido.");
        return res.status(500).json({ message: "Error interno del servidor." });
    }
    try {
        // Verifica el token y decodifica el payload
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        authReq.user = verified; // Adjuntamos el usuario decodificado a la petición
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Token inválido o expirado." });
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Middleware para autorizar roles específicos.
 */
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !roles.includes(userRole)) {
            return res
                .status(403)
                .json({ message: "No tienes permisos suficientes." });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
