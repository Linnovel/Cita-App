import sequelize from "../config/database"
import "../models"

export const syncDatabase = async (): Promise<void> => {
  await sequelize.sync({ alter: true })
}

export const testConnection = async (): Promise<void> => {
  await sequelize.authenticate()
}
