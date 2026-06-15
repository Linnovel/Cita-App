import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/database"

export interface UserAttributes {
  id: number
  usuario: string
  cedula: string
  fullName: string
  email: string
  password: string
  role: "admin" | "client"
  isApproved?: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id" | "isApproved" | "createdAt" | "updatedAt"
> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number
  public usuario!: string
  public cedula!: string
  public fullName!: string
  public email!: string
  public password!: string
  public role!: "admin" | "client"
  public isApproved!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cedula: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "client"),
      allowNull: false,
      defaultValue: "client",
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  },
)

export default User
