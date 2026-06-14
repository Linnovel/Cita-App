"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getAllAdmins = exports.getMe = exports.registerAdmin = exports.getUnapprovedClients = exports.approveUser = exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const authService_1 = require("../services/authService");
const register = async (req, res) => {
    try {
        const { usuario, cedula, fullName, email, password } = req.body;
        if (!fullName || !email || !password || !usuario || !cedula) {
            return res.status(400).json({
                message: "All fields (usuario, cedula, fullName, email, password) are required.",
            });
        }
        // Verificar si el email ya existe
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res
                .status(409)
                .json({ message: "Verifique la información e intente nuevamente" });
        }
        // Verificar si el usuario o cédula ya existen (Opcional, pero muy recomendado)
        const existingUsername = await User_1.default.findOne({ where: { usuario } });
        if (existingUsername) {
            return res.status(409).json({ message: "Username already taken." });
        }
        const existingID = await User_1.default.findOne({ where: { cedula } });
        if (existingID) {
            return res
                .status(409)
                .json({ message: "Verifique la información e intente nuevamente" });
        }
        const hashedPassword = await (0, authService_1.hashPassword)(password);
        const user = await User_1.default.create({
            usuario,
            cedula,
            fullName,
            email,
            password: hashedPassword,
            role: "client",
            isApproved: false,
        });
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
        });
    }
    catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({
            message: "Internal server error during registration.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required." });
    }
    const user = await User_1.default.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
    }
    const isPasswordValid = await (0, authService_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials." });
    }
    if (user.role === "client" && !user.isApproved) {
        return res.status(403).json({
            message: "Your account has not been approved yet.",
        });
    }
    const token = (0, authService_1.createToken)({ id: user.id, email: user.email, role: user.role });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
        message: "Login successful.",
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
        },
    });
};
exports.login = login;
const logout = async (_req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    return res.status(200).json({ message: "Logout successful." });
};
exports.logout = logout;
const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;
        // 1. Buscar al usuario
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.role === "admin") {
            return res
                .status(400)
                .json({ message: "Admin accounts do not require approval." });
        }
        if (user.isApproved) {
            return res.status(400).json({ message: "User is already approved." });
        }
        // 2. Aprobar al usuario
        user.isApproved = true;
        await user.save();
        return res.status(200).json({
            message: `User ${user.fullName} has been approved successfully.`,
            user: {
                id: user.id,
                isApproved: user.isApproved,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error approving user.", error });
    }
};
exports.approveUser = approveUser;
const getUnapprovedClients = async (_req, res) => {
    try {
        const users = await User_1.default.findAll({
            where: {
                role: "client",
                isApproved: false,
            },
            attributes: { exclude: ["password"] }, // Excluimos la contraseña por seguridad
        });
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error fetching unapproved users.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getUnapprovedClients = getUnapprovedClients;
const registerAdmin = async (req, res) => {
    try {
        const { usuario, cedula, fullName, email, password } = req.body;
        if (!fullName || !email || !password || !usuario || !cedula) {
            return res.status(400).json({
                message: "All fields are required to register an admin.",
            });
        }
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }
        const hashedPassword = await (0, authService_1.hashPassword)(password);
        const user = await User_1.default.create({
            usuario,
            cedula,
            fullName,
            email,
            password: hashedPassword,
            role: "admin",
            isApproved: true,
        });
        return res.status(201).json({
            message: "Admin registered successfully.",
            user: { id: user.id, email: user.email, role: user.role },
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error registering admin.", error });
    }
};
exports.registerAdmin = registerAdmin;
const getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (userId === undefined) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User_1.default.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching user info", error });
    }
};
exports.getMe = getMe;
const getAllAdmins = async (_req, res) => {
    try {
        const admins = await User_1.default.findAll({
            where: { role: "admin" },
            attributes: { exclude: ["password"] },
        });
        return res.status(200).json(admins);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error al obtener lista de administradores.", error });
    }
};
exports.getAllAdmins = getAllAdmins;
/**
 * Obtiene todos los usuarios registrados (Control de Registros)
 */
const getAllUsers = async (_req, res) => {
    try {
        const users = await User_1.default.findAll({
            attributes: { exclude: ["password"] },
            order: [["createdAt", "DESC"]],
        });
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: "Error al obtener usuarios", error });
    }
};
exports.getAllUsers = getAllUsers;
/**
 * Actualiza los datos de un usuario (Update del CRUD)
 */
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, email, usuario, cedula } = req.body;
        const user = await User_1.default.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: "Usuario no encontrado" });
        await user.update({ fullName, email, usuario, cedula });
        return res.status(200).json(user);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error al actualizar usuario", error });
    }
};
exports.updateUser = updateUser;
/**
 * Elimina un usuario (Delete del CRUD)
 */
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User_1.default.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: "Usuario no encontrado" });
        await user.destroy();
        return res.status(200).json({ message: "Usuario eliminado correctamente" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error al eliminar usuario", error });
    }
};
exports.deleteUser = deleteUser;
