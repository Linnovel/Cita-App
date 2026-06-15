# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos los package.json para aprovechar el cache de capas de Docker
COPY frontend/customer/package*.json ./frontend/customer/
COPY frontend/shared/package*.json ./frontend/shared/

# Instalamos dependencias específicamente para el proyecto
WORKDIR /app/frontend/customer
RUN npm install
RUN ln -s /app/frontend/customer/node_modules /app/node_modules

WORKDIR /app
COPY frontend/shared ./frontend/shared
COPY frontend/customer ./frontend/customer

WORKDIR /app/frontend/customer
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=builder /app/frontend/customer/dist /usr/share/nginx/html 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]