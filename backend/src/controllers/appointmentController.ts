import { Request, Response } from "express"
import { fn, col } from "sequelize"
import AppointmentRequest from "../models/AppointmentRequest"
import User from "../models/User"
import { AuthenticatedRequest } from "../middlewares/authMiddleware"

export const createRequest = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { type, observation } = req.body
    const userId = req.user?.id

    if (userId === undefined) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!type || !observation) {
      return res
        .status(400)
        .json({ message: "Tipo de solicitud y observación son requeridos." })
    }

    const newRequest = await AppointmentRequest.create({
      userId,
      type,
      observation,
    })

    return res.status(201).json(newRequest)
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al crear la solicitud de cita.", error })
  }
}

export const getAppointmentStats = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Agregamos el conteo por tipo para el gráfico
    const statsByType = await AppointmentRequest.findAll({
      attributes: ["type", [fn("COUNT", col("id")), "count"]],
      group: ["type"],
    })

    const totalAppointments = await AppointmentRequest.count()
    const pendingAppointments = await AppointmentRequest.count({
      where: { status: "Nuevo" },
    })

    // Conteos de usuarios
    const totalAdmins = await User.count({ where: { role: "admin" } })
    const totalClients = await User.count({ where: { role: "client" } })

    return res.status(200).json({
      stats: statsByType,
      totalAppointments,
      pendingAppointments,
      totalAdmins,
      totalClients,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener estadísticas de citas.", error })
  }
}

export const getMyRequests = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.id

    if (userId === undefined) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const requests = await AppointmentRequest.findAll({
      where: { userId },
      order: [["id", "DESC"]],
    })

    return res.status(200).json(requests)
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener tus solicitudes.", error })
  }
}

export const getAllRequests = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const requests = await AppointmentRequest.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["fullName", "email", "cedula"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return res.status(200).json(requests)
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener todas las solicitudes.", error })
  }
}

export const updateStatus = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const requestId = parseInt(req.params.requestId, 10)
    const { status } = req.body

    if (!status || isNaN(requestId)) {
      return res.status(400).json({ message: "El estado es requerido." })
    }

    const appointment = await AppointmentRequest.findByPk(requestId)
    if (!appointment) {
      return res.status(404).json({ message: "Solicitud no encontrada." })
    }

    appointment.status = status
    await appointment.save()

    const updated = await AppointmentRequest.findByPk(requestId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["fullName", "email", "cedula"],
        },
      ],
    })

    return res.status(200).json(updated)
  } catch (error) {
    console.error("Critical Error [updateStatus]:", error)
    return res.status(500).json({
      message: "Error al actualizar el estado de la solicitud.",
      error: error instanceof Error ? error.message : "Internal Server Error",
    })
  }
}
