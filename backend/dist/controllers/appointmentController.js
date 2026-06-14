"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getAllRequests = exports.getMyRequests = exports.getAppointmentStats = exports.createRequest = void 0;
const sequelize_1 = require("sequelize");
const AppointmentRequest_1 = __importDefault(require("../models/AppointmentRequest"));
const User_1 = __importDefault(require("../models/User"));
const createRequest = async (req, res) => {
    try {
        const { type, observation } = req.body;
        const userId = req.user?.id;
        if (userId === undefined) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!type || !observation) {
            return res
                .status(400)
                .json({ message: "Tipo de solicitud y observación son requeridos." });
        }
        const newRequest = await AppointmentRequest_1.default.create({
            userId,
            type,
            observation,
        });
        return res.status(201).json(newRequest);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error al crear la solicitud de cita.", error });
    }
};
exports.createRequest = createRequest;
const getAppointmentStats = async (_req, res) => {
    try {
        // Agregamos el conteo por tipo para el gráfico
        const statsByType = await AppointmentRequest_1.default.findAll({
            attributes: ["type", [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("id")), "count"]],
            group: ["type"],
        });
        const totalAppointments = await AppointmentRequest_1.default.count();
        const pendingAppointments = await AppointmentRequest_1.default.count({
            where: { status: "Nuevo" },
        });
        // Conteos de usuarios
        const totalAdmins = await User_1.default.count({ where: { role: "admin" } });
        const totalClients = await User_1.default.count({ where: { role: "client" } });
        return res.status(200).json({
            stats: statsByType,
            totalAppointments,
            pendingAppointments,
            totalAdmins,
            totalClients,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error al obtener estadísticas de citas.", error });
    }
};
exports.getAppointmentStats = getAppointmentStats;
const getMyRequests = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (userId === undefined) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const requests = await AppointmentRequest_1.default.findAll({
            where: { userId },
            order: [["id", "DESC"]],
        });
        return res.status(200).json(requests);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error al obtener tus solicitudes.", error });
    }
};
exports.getMyRequests = getMyRequests;
const getAllRequests = async (_req, res) => {
    try {
        const requests = await AppointmentRequest_1.default.findAll({
            include: [
                {
                    model: User_1.default,
                    as: "user",
                    attributes: ["fullName", "email", "cedula"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        return res.status(200).json(requests);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error al obtener todas las solicitudes.", error });
    }
};
exports.getAllRequests = getAllRequests;
const updateStatus = async (req, res) => {
    try {
        const requestId = parseInt(req.params.requestId, 10);
        const { status } = req.body;
        if (!status || isNaN(requestId)) {
            return res.status(400).json({ message: "El estado es requerido." });
        }
        const appointment = await AppointmentRequest_1.default.findByPk(requestId);
        if (!appointment) {
            return res.status(404).json({ message: "Solicitud no encontrada." });
        }
        appointment.status = status;
        await appointment.save();
        const updated = await AppointmentRequest_1.default.findByPk(requestId, {
            include: [
                {
                    model: User_1.default,
                    as: "user",
                    attributes: ["fullName", "email", "cedula"],
                },
            ],
        });
        return res.status(200).json(updated);
    }
    catch (error) {
        console.error("Critical Error [updateStatus]:", error);
        return res.status(500).json({
            message: "Error al actualizar el estado de la solicitud.",
            error: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};
exports.updateStatus = updateStatus;
