CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL PRIMARY KEY,
    "usuario" VARCHAR(255) UNIQUE NOT NULL,
    "cedula" BIGINT UNIQUE NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) DEFAULT 'client',
    "isApproved" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "AppointmentRequests" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
    "type" VARCHAR(255) NOT NULL,
    "observation" TEXT NOT NULL,
    "status" VARCHAR(50) DEFAULT 'Nuevo',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "Users" ("usuario", "cedula", "fullName", "email", "password", "role", "isApproved")
VALUES (
    'admin', 
    '12345678', 
    'Administrador Global', 
    'admin@citaapp.com', 
    '$2b$10$7vIUpXfW5v7v7uN1m5Zlue7K/vK9nI2M2B2R8I6U1G3W/Y4W1S/2e', 
    'admin', 
    TRUE
) ON CONFLICT DO NOTHING;

-- Nota: El hash de arriba corresponde a admin123* usando rounds=10
