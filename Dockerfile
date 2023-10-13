# Usar una imagen oficial de Node.js como base
FROM node:20.8

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install