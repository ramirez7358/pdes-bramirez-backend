# Etapa de construcción
FROM node:20.12.1 AS builder

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de definición de paquetes y el archivo .env
COPY package.json yarn.lock .env* ./

# Instalar dependencias
RUN yarn install

# Copiar el resto del código fuente de la aplicación
COPY . .

# Construir la aplicación
RUN yarn build

# Etapa de producción
FROM node:20.12.1

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de definición de paquetes y el archivo .env
COPY package.json yarn.lock .env* ./

# Instalar solo las dependencias de producción
RUN yarn install --prod

# Copiar el build de la etapa anterior
COPY --from=builder /usr/src/app/dist ./dist

# Exponer el puerto que usa la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main"]
