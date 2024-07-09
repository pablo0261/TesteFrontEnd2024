# Etapa de construcción
FROM node:16-alpine AS builder

# Set working directory
WORKDIR /bff

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install 

# Copiar archivos de código fuente y recursos estáticos
COPY tsconfig.json ./
COPY bff.ts ./
COPY controllers ./controllers

# Compilar la aplicación TypeScript a JavaScript
RUN npm run build

# Verificar el contenido de dist para asegurarse de que los archivos compilados estén presentes
RUN echo "Contenido de dist en la etapa de construcción:"
RUN ls -la ./dist

# Etapa final
FROM node:16-alpine

# Set working directory
WORKDIR /bff

# Copiar la carpeta dist desde la etapa de construcción
COPY --from=builder /bff/dist ./dist


# Copiar el archivo .env
COPY .env .env

# Verificar el contenido de dist en la etapa final
RUN echo "Contenido de dist en la etapa final:"
RUN ls -la ./dist

# Expose port
EXPOSE 3000

# Command to run the BFF
CMD ["node", "dist/bff.js"]
