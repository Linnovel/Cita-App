import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/database"
import User from "./User"

export interface AppointmentRequestAttributes {
  id: number
  userId: number
  type: "Odontología" | "Cardiología" | "Trámites" | "Oftalmología"
  observation: string
  status: "Nuevo" | "Procesando" | "Completado" | "Cancelado"
  createdAt?: Date
  updatedAt?: Date
}

interface AppointmentRequestCreationAttributes extends Optional<
  AppointmentRequestAttributes,
  "id" | "status" | "createdAt" | "updatedAt"
> {}

class AppointmentRequest
  extends Model<
    AppointmentRequestAttributes,
    AppointmentRequestCreationAttributes
  >
  implements AppointmentRequestAttributes
{
  public id!: number
  public userId!: number
  public type!: "Odontología" | "Cardiología" | "Trámites" | "Oftalmología"
  public observation!: string
  public status!: "Nuevo" | "Procesando" | "Completado" | "Cancelado"
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

AppointmentRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "Odontología",
        "Cardiología",
        "Trámites",
        "Oftalmología",
      ),
      allowNull: false,
    },
    observation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Nuevo", "Procesando", "Completado", "Cancelado"),
      allowNull: false,
      defaultValue: "Nuevo",
    },
  },
  {
    sequelize,
    modelName: "AppointmentRequest",
    tableName: "appointment_requests",
    timestamps: true,
  },
)

// Definición de Relaciones
User.hasMany(AppointmentRequest, { foreignKey: "userId", as: "appointments" })
AppointmentRequest.belongsTo(User, { foreignKey: "userId", as: "user" })

export default AppointmentRequest
