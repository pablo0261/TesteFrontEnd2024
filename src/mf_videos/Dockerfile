# Dockerfile para mf_videos
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g typescript
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["node", "dist/app.js"]
