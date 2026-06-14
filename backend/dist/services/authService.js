"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDefaultAdminUser = exports.createToken = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || "citaapp-dev-secret";
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, 10);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hash) => {
    return bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
const createToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "8h" });
};
exports.createToken = createToken;
const ensureDefaultAdminUser = async () => {
    const existingAdmin = await User_1.default.findOne({ where: { role: "admin" } });
    if (existingAdmin) {
        return;
    }
    const hashedPassword = await (0, exports.hashPassword)("admin123*");
    await User_1.default.create({
        fullName: "Administrador Principal",
        email: "admin@citaapp.com",
        password: hashedPassword,
        role: "admin",
        isApproved: true,
        usuario: "admin",
        cedula: "0000000000",
    });
};
exports.ensureDefaultAdminUser = ensureDefaultAdminUser;
