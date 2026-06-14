# CitaApp Backend

This folder contains the TypeScript REST API for the CitaApp appointment-management platform.

## Current stack

- Express + TypeScript
- Sequelize + PostgreSQL
- JWT-ready structure for authentication+
- Render para la base de datos

## Scripts

- npm install
- npm run dev
- npm run build

## Database notes

- The Sequelize connection is configured in src/config/database.ts.
- Core models are defined in src/models/.
- Use Render for the PostgreSQL instance and TablePlus to inspect the tables.
