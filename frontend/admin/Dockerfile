# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# 1. Copiamos los package.json desde el contexto raíz
COPY frontend/admin/package*.json ./frontend/admin/
COPY frontend/shared/package*.json ./frontend/shared/

# 2. Nos movemos a la carpeta de admin para instalar dependencias
WORKDIR /app/frontend/admin
RUN npm install

# 3. El truco del enlace simbólico para que la carpeta 'shared' encuentre los módulos
RUN ln -s /app/frontend/admin/node_modules /app/node_modules

# 4. Volvemos a la raíz del contenedor para copiar el código fuente real
WORKDIR /app
COPY frontend/shared ./frontend/shared
COPY frontend/admin ./frontend/admin

# 5. Entramos de nuevo a admin para compilar
WORKDIR /app/frontend/admin
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
# ⚠️ OJO: La ruta de origen cambió porque ahora compila dentro de /app/frontend/admin/dist
COPY --from=builder /app/frontend/admin/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]