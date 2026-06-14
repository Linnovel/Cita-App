import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User"

const JWT_SECRET = process.env.JWT_SECRET || "citaapp-dev-secret"

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10)
}

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export const createToken = (payload: {
  id: number
  email: string
  role: string
}): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" })
}

export const ensureDefaultAdminUser = async (): Promise<void> => {
  const existingAdmin = await User.findOne({ where: { role: "admin" } })

  if (existingAdmin) {
    return
  }

  const hashedPassword = await hashPassword("admin123*")

  await User.create({
    fullName: "Administrador Principal",
    email: "admin@citaapp.com",
    password: hashedPassword,
    role: "admin",
    isApproved: true,
    usuario: "admin",
    cedula: "0000000000",
  })
}
