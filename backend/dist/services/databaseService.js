"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.syncDatabase = void 0;
const database_1 = __importDefault(require("../config/database"));
require("../models");
const syncDatabase = async () => {
    // Usamos alter: true para mantener los datos existentes al reiniciar el servidor
    await database_1.default.sync({ alter: true });
};
exports.syncDatabase = syncDatabase;
const testConnection = async () => {
    await database_1.default.authenticate();
};
exports.testConnection = testConnection;
