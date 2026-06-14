"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class AppointmentRequest extends sequelize_1.Model {
}
AppointmentRequest.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("Odontología", "Cardiología", "Trámites", "Oftalmología"),
        allowNull: false,
    },
    observation: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("Nuevo", "Procesando", "Completado", "Cancelado"),
        allowNull: false,
        defaultValue: "Nuevo",
    },
}, {
    sequelize: database_1.default,
    modelName: "AppointmentRequest",
    tableName: "appointment_requests",
    timestamps: true,
});
// Definición de Relaciones
User_1.default.hasMany(AppointmentRequest, { foreignKey: "userId", as: "appointments" });
AppointmentRequest.belongsTo(User_1.default, { foreignKey: "userId", as: "user" });
exports.default = AppointmentRequest;
