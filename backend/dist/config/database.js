"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseUrl = process.env.DATABASE_URL;
const dbHost = process.env.DB_HOST || process.env.PGHOST || "localhost";
const dbPort = Number(process.env.DB_PORT || process.env.PGPORT || 5432);
const dbName = process.env.DB_NAME || process.env.PGDATABASE || "citaapp";
const dbUser = process.env.DB_USER || process.env.PGUSER || "postgres";
const dbPassword = process.env.DB_PASSWORD || process.env.PGPASSWORD || "postgres";
const connectionString = databaseUrl ||
    `postgres://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}`;
const useSsl = Boolean(databaseUrl && /render\.com/i.test(databaseUrl)) ||
    /render\.com/i.test(dbHost);
const sequelize = new sequelize_1.Sequelize(connectionString, {
    dialect: "postgres",
    logging: false,
    dialectOptions: useSsl
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        }
        : undefined,
});
exports.default = sequelize;
