# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Producción (AQUÍ ESTÁ EL CAMBIO)
FROM node:20-alpine 
WORKDIR /app
COPY package*.json ./
# Solo instalamos dependencias de producción
RUN npm install --only=production

# Copiamos los archivos necesarios desde la etapa 'builder'
COPY --from=builder /app/config ./config 
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/seeders ./seeders

EXPOSE 3000
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node dist/server.js"]