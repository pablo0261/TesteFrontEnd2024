# Dockerfile para mf_drawer
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g typescript ts-node
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/app.js"]
