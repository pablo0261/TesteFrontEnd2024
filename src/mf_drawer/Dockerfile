# Etapa de construcción
FROM node:16-alpine as builder

WORKDIR /app

# Copiar archivos de configuración y dependencias de producción
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production
RUN npm install -g typescript
RUN npm install

# Copiar archivos de código fuente y recursos estáticos
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
COPY app.ts ./

# Compilar la aplicación TypeScript a JavaScript
RUN npm run build

# Verificar el contenido de dist para asegurarse de que app.js esté presente
RUN echo "Contenido de dist en la etapa de construcción:"
RUN ls -la ./dist

# Etapa final
FROM node:16-alpine

WORKDIR /app

# Copiar la carpeta dist desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# Copiar otros archivos necesarios
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Copiar el archivo .env
COPY .env .env

# Verificar el contenido de dist en la etapa final
RUN echo "Contenido de dist en la etapa final:"
RUN ls -la ./dist

EXPOSE 3001

# Comando para iniciar la aplicación Node.js desde el directorio dist
CMD ["node", "dist/app.js"]
