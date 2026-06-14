import sequelize from "../config/database"
import "../models"

export const syncDatabase = async (): Promise<void> => {
  // Usamos alter: true para mantener los datos existentes al reiniciar el servidor
  await sequelize.sync({ alter: true })
}

export const testConnection = async (): Promise<void> => {
  await sequelize.authenticate()
}
